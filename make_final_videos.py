import os
import requests
from moviepy.editor import VideoFileClip, concatenate_videoclips, CompositeVideoClip
import subprocess



def concatenate_videos(summary_file, output_file):

    with open(summary_file, 'r') as f:
        urls = f.read().split(',')
    urls = [url.strip() for url in urls]

    # Download videos
    video_files = []
    for url in urls:
        filename = url.split("/")[-1]
        filename = os.path.join("video", filename)
        response = requests.get(url)
        with open(filename, 'wb') as f:
            f.write(response.content)
        video_files.append(filename)
    clips = [VideoFileClip(f) for f in video_files]

    # put black background behind them
    max_width = max(*[clip.w for clip in clips])
    max_height = max(*[clip.h for clip in clips])    
    composite_clips = []
    for clip in clips:
        background = CompositeVideoClip([clip.crossfadeout(1)], size=(max_width, max_height), bg_color=[0, 0, 0])
        background.audio = None
        clip_fit = clip.set_position("center")
        composite_clip = CompositeVideoClip([background, clip_fit], size=(max_width, max_height))
        composite_clips.append(composite_clip)

    #clips_resized = [clip.resize((min_width, min_height)) for clip in clips]
    # clips_fit = [clip.set_position("center") for clip in clips]
    #composite_clips = [CompositeVideoClip([background, clip], size=(max_width, max_height)) for clip in clips_fit]
    final_clip = concatenate_videoclips(composite_clips)
    final_clip.write_videofile(output_file)

    return output_file


files = os.listdir("output")
for file in files:
    summary_filename = os.path.join("output", file)
    clip_filename = summary_filename.replace(".txt", ".mp4")
    if not os.path.exists(clip_filename):
        concatenate_videos(summary_filename, clip_filename)