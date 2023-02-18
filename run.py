import os

for i in range(1000):
    res = os.system("node create_conversation.js")
    print(res)