# Diplomna

Repository for Raspberry Pi based incubator

# install: [node] and [mongodb]

Almost all [node] installs include and [npm]

You can install node from it's official page:

https://nodejs.org/en/download/

Or if you are running Linux distribution and it's include here:

https://github.com/nodesource/distributions

you can install it from there.

MongoDB can be installed from source or installed via package meneger.

eg. by running [sudo apt-get install mongodb] if you are using Debian based distribution.

# Test User Interface By faking an incubator

Run the following sequence of commands from single machine:

First open two terminal Tabs.

Enter following in first one:

```bash
cd ./server
npm install
npm start
```

And this in second one:

```bash
cd ./incubator
npm install
npm start
```

You should see message: OK in second terminal window if there are no errors.

Now open browser and navigate to 127.0.0.1:4000

You should see a field asking to for Incubator id.

Enter: bobi, in it and you should see the app UI.





