BeagleY-AI + Thistle Tech Codelab: OTA Updates Made Easy
BeagleBoard.org & Thistle Technologies – Secure OTA Updates on BeagleY‑AI
Welcome to our hands-on codelab! Today we’ll connect the BeagleY-AI single-board computer with Thistle’s OTA Update platform.
Goal: By the end, you’ll have a BeagleY-AI device set up with Thistle’s update client, able to receive a simple OTA update (a script that blinks an LED via GPIO).
This session is for everyone – whether you’re new to embedded Linux or a seasoned pro. We’ll start from basics and gradually build up to using Thistle OTA.
Format: We’ll alternate between slides (concepts & instructions) and live demos on the BeagleY-AI. Feel free to follow along!
(We’ll use a simple, elegant slide style with a teal motif for clarity.)
docs.beagleboard.org
docs.thistle.tech
Agenda: From Zero to OTA Hero
Introduction: What are BeagleY-AI and Thistle Tech, and why use them together?
Setup Overview: Required hardware and accounts – preparing your BeagleY-AI and Thistle project.
Flashing BeagleY-AI: Using BeagleBoard’s bb-imager to get the latest OS on your microSD
docs.beagleboard.org
.
Thistle Tools Installation: Setting up the Thistle Update Client on the device and the Release Helper on your workstation.
Configuring Thistle OTA: Creating a Thistle project, obtaining the API token, and initializing the device configuration.
Creating an OTA Update: Packaging a simple LED blink script using Thistle Release Helper.
Deploy & Test: Releasing the update, running the Thistle client on the device, and verifying our LED toggle in action.
Wrap-Up & Next Steps: Recap, Q&A, and a peek at what’s coming in next month’s advanced codelab (Secure Boot & A/B updates).
(We’ll keep instructions clear and straightforward. Let’s dive in!)
BeagleY-AI at a Glance
docs.beagleboard.org
docs.beagleboard.org
BeagleY-AI (sometimes nicknamed “Beagley-AI”) is a powerful open-source SBC designed for edge AI applications. It’s built around the TI AM67A vision SoC, featuring a 
quad-core Arm® Cortex-A53 at 1.4 GHz and specialized AI accelerators
docs.beagleboard.org
.
It offers 4 TOPS of AI performance in a fanless design, plus dual C7x DSPs, microcontrollers for real-time I/O, and a host of peripherals (USB 3.0, Gigabit Ethernet, Wi-Fi 
6/BLE 5.4, HDMI, MIPI camera connectors, etc.)
docs.beagleboard.org
docs.beagleboard.org
.
The board has a 40-pin GPIO header (Raspberry Pi compatible pin layout) for hardware projects. We’ll use one of these GPIO pins to blink an LED in our demo.
Why BeagleY-AI? It blends open-source hardware with industrial-ready features, making it great for prototyping and learning. Today, it’s our target device for implementing 
robust OTA (Over-The-Air) updates.
Fun fact: “BeagleY” is the board name – continuing BeagleBoard’s tradition (think BeagleBone, etc.). The Y stands for “Why,” emphasizing open innovation (as in “Why not? 
Let’s innovate!”).
(If you’ve never used a BeagleBoard, don’t worry – we’ll cover how to get it up and running. Seasoned Beagle users, get ready to add Thistle’s OTA superpowers to your 
board.)
Thistle Technologies Overview – Secure OTA Updates
What is Thistle? Thistle Tech provides a secure, end-to-end OTA update platform for embedded devices. Think of it as an “update pipeline” that ensures firmware or software 
updates are delivered reliably and securely to IoT and embedded systems
docs.thistle.tech
.
Thistle Update Client (TUC): A lightweight agent (written in Rust for safety and performance) that runs on your device. It fetches updates, cryptographically verifies them, 
and applies them safely
docs.thistle.tech
docs.thistle.tech
.
Thistle Release Helper (TRH): A developer tool we run on our workstation to package update files, generate manifests, sign them, and upload to Thistle’s cloud
docs.thistle.tech
docs.thistle.tech
.
Security & Trust: Every update is cryptographically signed by the manufacturer (that’s you!) and verified on the device. Only updates signed with your private key will be 
accepted – even Thistle’s servers can’t alter your payload
docs.thistle.tech
. By default, the first time a device connects it uses a “Trust on First Use (TOFU)” model (device keys are established on initial contact)
docs.thistle.tech
.
A/B and File Updates: Thistle supports full A/B system updates (two partitions for fail-safe rollback) and simpler file-level updates. In both cases, if something goes 
wrong (bad update, power loss, etc.), the device can fall back to a known-good state – no bricked devices!
docs.thistle.tech
. Today we’ll focus on a quick file update (no complex partitioning) to keep things simple
docs.thistle.tech
.
Why Thistle OTA? It handles the hard parts – backend infrastructure, signing, delta distribution, fail-safes – so you can deliver updates to potentially thousands of 
devices with confidence. Perfect for professional products, and accessible enough for makers (free community tier for individuals).
(In short, Thistle helps ensure that updating your BeagleY-AI in the field is as safe as updating your phone – and if an update fails, your device recovers automatically. 
Now let’s get our environment ready!)
Getting Set Up – Hardware and Accounts
Before we start coding or updating, let’s make sure we have everything prepared:
BeagleY-AI Board & Accessories: You’ll need your BeagleY-AI board, the included antenna (for Wi-Fi/Bluetooth, attach it if using wireless), and a stable 5V/3A power source. 
You can power via USB-C (some laptops can power it at ~1A, but a dedicated supply is recommended to avoid undervoltage)
docs.beagleboard.org
.
Have a microSD card (32 GB) to flash the OS. (BeagleY-AI has onboard eMMC, but we’ll boot from microSD for this codelab for simplicity.)
Optionally, an LED, a ~2.2kΩ resistor, and jumper wires if you want to physically wire an LED to a GPIO pin for the blink demo
docs.beagleboard.org
. (We’ll use HAT Pin 8 / GPIO14 on the header as our output pin
docs.beagleboard.org
.)
Connection to the Board: Easiest is via USB-C cable – it can power the board and provide a USB networking interface. The board will appear to your PC with a specific IP 
(typically 192.168.7.2) for SSH, and it also presents a serial console. Alternatively, you can hook up an HDMI display/keyboard or use the debug UART, but USB tethering is 
the quickest way to get a shell.
Host Computer: Your laptop/PC for running the Thistle Release Helper and interacting with the board. This can be Windows, Mac, or Linux. (We’ll show commands mainly in a 
Unix-style shell.)
Thistle Account: Sign up for a free account on Thistle Control Center (the web UI) if you haven’t already. Once logged in, create a project for this codelab (e.g., 
“BeagleYAI-OTA Demo”). The project is where your device and update manifests will live.
Get your Project Access Token: In the Thistle web app, find the Project Settings → API (Project Access) Token
docs.thistle.tech
. This token will allow the CLI tools to upload releases and your device to fetch them. Keep it handy (it’s like an API key).
(By this point, you should have hardware in front of you and a Thistle account ready. Next, we’ll flash the BeagleY-AI with the OS and prepare it for Thistle integration.)
Flashing the BeagleY-AI with bb-imager
To run Thistle’s client, our board needs an OS. We’ll use the official BeagleBoard-provided Debian image:
Download & Install bb-imager: This is BeagleBoard’s imaging tool (similar to Raspberry Pi Imager)
docs.beagleboard.org
. Grab it from the BeagleBoard website (available for Windows, macOS, Linux).
Flash the microSD:
Open bb-imager, click “CHOOSE DEVICE” and select “BeagleY-AI”
docs.beagleboard.org
.
Click “CHOOSE OS”, and select the Recommended OS for BeagleY-AI (likely a Debian 12-based image)
docs.beagleboard.org
.
Insert your microSD card into your computer. In bb-imager, select that card as the target and hit “WRITE”. This will download and flash the OS image. (Tip: You can 
optionally edit the sysconf.txt on the flashed card to set a custom username/password before first boot
docs.beagleboard.org
docs.beagleboard.org
, or you can go with defaults: user “debian”.)
Boot the Board:
Ensure power is off, insert the microSD into the BeagleY-AI’s slot, then power on (connect USB-C power or cable to PC). The board should boot from microSD (the quick-start 
card has instructions if you need to force SD boot mode).
Give it a minute on first boot. You should see LEDs on the board light up as it boots. If connected via HDMI, you’ll see the GUI or login prompt. If over USB networking, 
the board will enumerate – check that you got a new network interface on your PC.
Access the Terminal:
On a Linux/Mac host, the board usually appears at 192.168.7.2 (over USB). Try SSH: ssh debian@192.168.7.2 (password might be temppwd or the one you set; the image’s release 
notes mention the default). On Windows, the board might show as a serial COM port for terminal access, or use an SSH client with the RNDIS network.
Alternatively, use a serial console (Baud 115200 8N1) via the debug UART if needed.
Login: Once you get a login prompt, use username/password (default debian / BeagleBone or the credentials you configured
docs.beagleboard.org
 – check the Beagle documentation for the exact default password if unsure).
You should now have a shell on the BeagleY-AI! A quick sanity check: try uname -a (should show a Linux kernel, e.g., 5.x) and perhaps verify internet connectivity (ping 
google.com) if using Ethernet/Wi-Fi.
(Now our BeagleY-AI is running a base OS. Next, let’s bring in the Thistle OTA tools on both the device and our workstation.)
Installing Thistle OTA Tools (TUC & TRH)
To use Thistle, we need two components: the Thistle Update Client (TUC) on the device, and the Thistle Release Helper (TRH) on our dev machine.
Thistle Release Helper (TRH) on Workstation: This CLI tool packages and uploads updates. Download the latest release (v1.5.0 as of now) for your OS from Thistle’s site
docs.thistle.tech
docs.thistle.tech
:
Linux/macOS: Download the trh-<version>-x86_64-unknown-linux-musl.gz (for Linux) or trh-<version>-x86_64-apple-darwin.gz (for Mac). Example for Linux:
VER=1.5.0  
curl -LO https://downloads.thistle.tech/embedded-client/$VER/trh-$VER-x86_64-unknown-linux-musl.gz  
gunzip trh-$VER-x86_64-unknown-linux-musl.gz && chmod +x trh-$VER-x86_64-unknown-linux-musl  
ln -s trh-$VER-x86_64-unknown-linux-musl trh   # optional: create a symlink  
(On Windows, download the .exe.gz, gunzip it, and you can run trh.exe in PowerShell or CMD.)
After downloading, test it: run ./trh --help. You should see output describing the tool and subcommands (init, prepare, release, etc.)
docs.thistle.tech
docs.thistle.tech
.
Thistle Update Client (TUC) on BeagleY-AI: Now install the client on the device:
Log into the BeagleY-AI (SSH or local). Download the TUC binary for ARM64 (aarch64) Linux
docs.thistle.tech
docs.thistle.tech
:
VER=1.5.0  
curl -LO https://downloads.thistle.tech/embedded-client/$VER/tuc-$VER-aarch64-unknown-linux-musl.gz  
gunzip tuc-$VER-aarch64-unknown-linux-musl.gz  
chmod +x tuc-$VER-aarch64-unknown-linux-musl  
sudo mv tuc-$VER-aarch64-unknown-linux-musl /usr/local/bin/tuc  
This fetches the client, decompresses it, makes it executable, and moves it into a system-wide location.
Test on device: Run tuc --help | head -n 3. It should print “Thistle Update Client (TUC) …” confirming it’s installed
docs.thistle.tech
.
Check Versions: Ensure both TRH and TUC are the same version (here 1.5.0). This avoids any compatibility issues. The --help or a --version flag can confirm.
At this stage, our toolchain is ready: TRH on your PC (to prepare and push updates) and TUC on the BeagleY-AI (to receive updates).
(We’re almost ready to do an OTA update! Next, we’ll configure Thistle for our project and device.)
Thistle Project Configuration & Device Init
Now we link the device to your Thistle project:
Environment Variable for Token: On your workstation, export the Thistle Project Access Token you obtained:
export THISTLE_TOKEN="<Your Project Access Token>"
(Linux/Mac note: you can also do export THISTLE_TOKEN=$(cat) then paste the token and hit Ctrl-D
docs.thistle.tech
. Windows PowerShell: $env:THISTLE_TOKEN="PASTE_TOKEN_HERE")
Initialize Thistle Config (TRH init): In a working directory on your PC, run:
./trh init --persist="/boot"
This creates a new Thistle configuration for our device and project
docs.thistle.tech
. Key things happening here:
It contacts Thistle’s backend using your token to get a device enrollment token (allowing a device to register with your project)
docs.thistle.tech
.
Generates a signing key pair (if not already present) for signing updates.
Produces two files in your directory:
config.json – the device’s configuration (includes the project ID, device enrollment info, update server URL, etc.). It references the persistent dir we chose (/boot in 
this case) to store update state.
manifest.json – a template manifest for updates.
The --persist="/boot" flag tells Thistle that the device has a directory at /boot that survives reboots (on BeagleY-AI, /boot is a FAT partition that stays mounted). 
Thistle will use this for storing state like the current manifest and any needed persistent files. Using a persistent path is important for A/B updates and tracking version 
state.
We’re using Trust On First Use (TOFU) provisioning by default, meaning the first time our device connects it will auto-enroll and be trusted
docs.thistle.tech
. (No need to pre-register device IDs manually.)
Transfer Config to Device: We need the device to have its config.json:
Copy it to the BeagleY-AI (from your PC):
scp config.json debian@192.168.7.2:/tmp/tuc-config.json
(Use your device’s IP or hostname; adjust username if not debian.)
SSH into the device and move the config to the persistent location:
sudo mv /tmp/tuc-config.json /boot/tuc-config.json
We put it in /boot because the Beagle’s boot partition is persistent and accessible early – aligning with how we set --persist. The Thistle client can read it from there.
Result: Now the BeagleY-AI has a Thistle config file that ties it to your project and holds its unique keys. We are ready to deploy an update to this project, which the 
device will fetch.
(In summary: we created a project, got a token, initialized config, and placed that config on the device. Next up: let’s create our actual update – a blink script – and 
send it over the air!)
Creating an OTA Update: Blink Script on GPIO
Time for the fun part: preparing a release that will toggle an LED on the BeagleY-AI.
What We’re Deploying: A simple bash script that blinks an LED on and off. We’ll use the gpioset tool (part of libgpiod, which is pre-installed on the Beagle images) to 
drive a GPIO high or low
docs.beagleboard.org
. Our script will loop forever, creating a blinking effect.
GPIO Choice: We use GPIO14 (Hat Pin 8) – this pin is convenient and often used in examples
docs.beagleboard.org
. You should connect an LED + series resistor from that pin to GND as shown in the BeagleY-AI docs
docs.beagleboard.org
 (long leg to GPIO14, short leg to GND through the resistor). Ensure it’s oriented correctly; when the pin outputs HIGH (3.3V), current flows and the LED lights up.
Prepare the Files:
On your workstation, create a directory for the update payload, e.g., mkdir -p ota-files.
Inside it, create the blink script file. Let’s name it blink.sh. You can use an editor or echo a heredoc:
cat > ota-files/blink.sh <<'EOF'
#!/bin/bash
# Simple LED blink script for GPIO14 on BeagleY-AI
gpioset $(gpiofind GPIO14)=0   # ensure off at start
echo "Blink script started – LED on GPIO14 will flash every 1s."
while true; do
  gpioset $(gpiofind GPIO14)=1   # LED ON
  sleep 1
  gpioset $(gpiofind GPIO14)=0   # LED OFF
  sleep 1
done
EOF
chmod +x ota-files/blink.sh
This script uses an infinite loop to blink the LED on/off each second
docs.beagleboard.org
. We included an initial message and turn the LED off at start for good measure.
(Note: Alternatively, you could write the script directly on the Beagle and test it locally by running bash blink.sh. If you do, press Ctrl+C to stop it. The Beagle docs 
have a similar example called blinky.sh
docs.beagleboard.org
.)
Decide Install Location: We want to place this script on the device when the update applies. For example, we could put it in /usr/local/bin/ or in a dedicated directory 
under /opt. We’ll choose /opt/example/ for this demo (to mimic the style from Thistle docs)
docs.thistle.tech
.
Prepare the Manifest with TRH: Now package the update using Thistle Release Helper (on your PC):
Run:
./trh prepare --target=./ota-files --file-base-path=/opt/example
Here --target=./ota-files tells TRH to include everything in that folder (which is just our blink.sh file). --file-base-path=/opt/example means “when this gets installed on 
the device, place the contents of ota-files into /opt/example”
docs.thistle.tech
. So the script will end up at /opt/example/blink.sh on the Beagle.
The prepare command will compress the file, add it to manifest.json, and sign the manifest with your key
docs.thistle.tech
docs.thistle.tech
. If successful, it updates your local manifest.json to describe this release.
(Optional: TRH supports adding pre/post-install scripts or marking that a reboot is needed. In our case, blinking doesn’t require a reboot of the system, but we might want 
the blink to start automatically. We could configure a post-install action to launch the script or even a one-time reboot hook. However, to keep things simple, we’ll 
trigger it manually or with a basic approach.)
Upload (Release) the Update: With the manifest prepared, send it to Thistle’s backend:
Run: ./trh release
docs.thistle.tech
. This command uploads the manifest and the file payload to the Thistle cloud, associating it with your project (using the token).
If it succeeds, you have now “published” version 1 of your OTA update. Thistle’s service knows that the latest release for your project contains blink.sh to be installed at 
/opt/example/blink.sh.
Every device that is connected with the project’s config will be notified that an update is available (or will fetch it on next poll).
You can run ./trh fetch-current to see the manifest you just uploaded (optional)
docs.thistle.tech
docs.thistle.tech
.
(Great! We built and released our update in the cloud. Now it’s time to run the client on the device to actually pull this update down and see the LED blink.)
Deploying the Update to the BeagleY-AI
Now the magic happens on the device side:
Run the Thistle Update Client (TUC): On the BeagleY-AI, execute:
sudo tuc -c /boot/tuc-config.json
This starts the update client using the config we generated
docs.thistle.tech
. Because this is the first time, a few things will happen:
The client will enroll the device with the Thistle backend (using that enrollment token in config). You might see logs about “trust on first use” or device registration.
It will then contact the server to check for updates. The server should respond that there’s a new release (the one we just uploaded).
TUC will download the manifest and the payload securely. It will verify the signature of the manifest using the public key (corresponding to our private key that signed 
it). This ensures authenticity
docs.thistle.tech
.
After verification, it will install the file. Since our update is just a single file, the client will place blink.sh into /opt/example/ as instructed. Thistle handles this 
atomically – it won’t leave a half-written file. If something failed in download or verification, it would not install.
You should see console output on the device indicating that an update was fetched and applied. For example, “Update version 1 installed” or similar log messages (the exact 
wording can vary).
Verify on Device: Once tuc finishes (by default, TUC might stay running to listen for future updates – you can hit Ctrl+C to stop it if it’s in continuous mode), check that 
our file is there:
ls -l /opt/example/blink.sh
It should list the file. You can also cat /opt/example/blink.sh to see its content, confirming it matches what we created
docs.thistle.tech
.
Run the Blink Script: Let’s test it out! Execute on the Beagle:
bash /opt/example/blink.sh
You should see the message “Blink script started…” and then the LED wired to GPIO14 should start blinking on and off, once per second. 🎉 If you have the board in front of 
you, the LED’s blinking is the visual confirmation that our OTA update succeeded.
(If you included a manifest post-install hook to auto-run the script, the LED might have started blinking immediately after the update. If not, we run it manually now. 
Either approach demonstrates that the file arrived and works.)
You can stop the blinking with Ctrl+C. If this were a real firmware update, you’d perhaps integrate it into a service or have it auto-start on boot. For now, our focus was 
getting it delivered OTA.
docs.beagleboard.org
docs.beagleboard.org
What Just Happened? We seamlessly delivered a new piece of software to an embedded device over the air:
The process was secure (signed update) and atomic – if anything had gone wrong, the device would not apply a bad update. For example, had our script been critical system 
software that somehow failed, Thistle’s A/B verification model would allow rollback, but in a simple file case, it just ensures the file is correct before activating it.
We didn’t have to manually SCP files or remote into the device to update it – TUC handled it automatically once we published the release.
This is a basic example, but the same flow can update multiple files, binaries, configuration, or even full OS images, all with cryptographic verification and rollback 
safety.
(Take a moment to appreciate: you have set up modern OTA update infrastructure on a BeagleY-AI in under an hour! Next, let’s wrap up and discuss where to go from here.)
Wrap-Up: What We Achieved
Thistle OTA on BeagleY-AI: We configured a BeagleY-AI with the Thistle Update Client and successfully performed an OTA file update (our LED blink script). This included 
setting up a Thistle project, generating a device config, and using the release helper to package and deploy an update.
Hands-On Skills: Along the way, we practiced flashing the device with a fresh OS, installing binaries on both host and target, and using GPIO on the BeagleY-AI (blinking an 
LED via shell commands)
docs.beagleboard.org
. We also saw how Thistle ensures updates are signed and verified, giving us confidence in the update process
docs.thistle.tech
.
For Beginners: You got exposure to embedded Linux workflows (imaging a card, using SSH/serial, running shell commands on a board) and learned how an OTA system can simplify 
managing devices remotely.
For Pros: You saw Thistle’s approach to OTA – a flexible file-based update mechanism today, which can extend to full A/B rootfs updates with rollback. It integrates 
security (signing, optional secure boot chain) out-of-the-box, so you don’t have to reinvent that. The tooling (tuc/trh) is straightforward and scriptable, fitting into CI 
or build systems easily.
docs.thistle.tech
docs.thistle.tech
Troubleshooting & Tips: If your update didn’t apply, check the following:
Did the device have internet access to reach Thistle’s servers?
Was the THISTLE_TOKEN set correctly when running trh commands? A wrong or expired token could cause upload failures.
TUC logs are your friend – run it in verbose mode (-v or --log-level info) to see more detail if needed. And the Thistle web portal can show device status and last seen 
time.
If the LED isn’t blinking, ensure your wiring is correct and that you used the right GPIO pin. Also, confirm libgpiod tools (gpioset, gpiofind) are present on the device – 
in the BeagleY-AI default Debian, they should be, but you can install gpiod if not
docs.beagleboard.org
.
Next Steps: Secure Boot and Advanced OTA (Coming Soon)
What’s Next? In our next codelab (next month), we’ll build on this foundation. We’ll introduce Secure Boot and Bootloader A/B updates on the BeagleY-AI using Thistle:
We’ll see how to ensure that the device’s bootloader and kernel are cryptographically verified at boot (Thistle Verified Boot)
docs.thistle.tech
.
We’ll configure dual root file systems (A/B partitions) for full image OTA, so that the BeagleY-AI can always revert to a known-good system if an update fails mid-boot.
Essentially, we’ll tackle the “bootloader AB stuff” that we postponed today – this adds another layer of reliability for OTA updates at the firmware level.
Prepping for Next Time: If you want to explore ahead:
Check out Thistle’s docs on Secure Boot & TVB (Thistle Verified Boot)
docs.thistle.tech
 and the OTA A/B guide for BeagleBoards (if available). Also, the Orange Pi example we glanced at shows how to set up dual partitions for A/B updates
docs.thistle.tech
docs.thistle.tech
 – the process for BeagleY-AI will be similar.
Make sure you have a way to interface with the BeagleY-AI’s bootloader (UART or HDMI) in case we need to troubleshoot U-Boot in the next session.
Resources & Community:
Thistle documentation: docs.thistle.tech (great guides and reference for all commands we used).
BeagleBoard documentation: docs.beagleboard.org (for hardware specifics, pinouts, and community projects).
BeagleBoard forums and Discord – if you have questions about BeagleY-AI, the community is very helpful
docs.beagleboard.org
.
Thistle developer community (forums or Slack) – get support straight from the Thistle team and other users
docs.thistle.tech
.
Feedback: We’d love to hear how this codelab went for you. Were you able to get your device updating? Any hiccups? This helps us improve future sessions.
Conclusion
You’ve just implemented a secure OTA update on a modern embedded Linux device in a short time! This is a capability that adds immense value to IoT projects – you can update 
devices in the field with confidence. In today’s codelab, a simple blinking LED marked our success, but imagine deploying real firmware changes or new features to hundreds 
of devices with similar ease. Thistle’s platform and the BeagleY-AI’s robustness make that not only possible, but straightforward. Key Takeaway: OTA updates don’t have to 
be scary or complex. By using the right tools and following a clear process, even a beginner can set up a professional-grade update system. As you grow your projects, 
features like cryptographic signing, verified boot, and fail-safe partitions will have you covered – and you now have a taste of all of those. Thank you for joining this 
session! Happy hacking with BeagleY-AI and Thistle OTA, and see you next time for the deep dive into secure boot and advanced OTA techniques. (End of presentation. Now 
let’s move to the live Q&A or any demos you’d like to revisit. Feel free to ask questions about any step, or broader queries on OTA update strategies.) 
docs.thistle.tech
docs.thistle.tech
Speaker’s note: The slide deck uses a simple teal-themed template to keep things visually clean and modern. Each section we discussed is one or two slides, mixing bullet 
points and a few visuals (board photo, simple diagrams of update flow, etc.) to reinforce concepts. During the live demo parts, I’ll switch from slides to my terminal/IDE 
to show the actual commands and results in real-time, then switch back to slides for explanation. This approach keeps both beginners and advanced attendees engaged – we 
explain concepts clearly, then immediately demonstrate them. The full script above can serve as detailed speaker notes to ensure nothing important is missed.
Citations

Introduction — BeagleBoard Documentation

https://docs.beagleboard.org/boards/beagley/ai/01-introduction.html

Thistle OTA Update - Thistle Docs

https://docs.thistle.tech/update/overview

BeagleY-AI Quick Start — BeagleBoard Documentation

https://docs.beagleboard.org/boards/beagley/ai/02-quick-start.html

Introduction — BeagleBoard Documentation

https://docs.beagleboard.org/boards/beagley/ai/01-introduction.html

Introduction — BeagleBoard Documentation

https://docs.beagleboard.org/boards/beagley/ai/01-introduction.html

Introduction — BeagleBoard Documentation

https://docs.beagleboard.org/boards/beagley/ai/01-introduction.html

Introduction — BeagleBoard Documentation

https://docs.beagleboard.org/boards/beagley/ai/01-introduction.html

Introduction — BeagleBoard Documentation

https://docs.beagleboard.org/boards/beagley/ai/01-introduction.html

Thistle OTA Update - Thistle Docs

https://docs.thistle.tech/update/overview

Thistle OTA Update - Thistle Docs

https://docs.thistle.tech/update/overview

Command Line Tools - Thistle Docs

https://docs.thistle.tech/update/command_line_tools

Command Line Tools - Thistle Docs

https://docs.thistle.tech/update/command_line_tools

File Update - Thistle Docs

https://docs.thistle.tech/update/get_started/file_update

Thistle Verified Boot (TVB) on Orange Pi Zero 3 - Thistle Docs

https://docs.thistle.tech/hardware/orange_pi/zero3_tvb

BeagleY-AI Quick Start — BeagleBoard Documentation

https://docs.beagleboard.org/boards/beagley/ai/02-quick-start.html

Using GPIO — BeagleBoard Documentation

https://docs.beagleboard.org/boards/beagley/ai/demos/using-gpio.html

Using GPIO — BeagleBoard Documentation

https://docs.beagleboard.org/boards/beagley/ai/demos/using-gpio.html

File Update - Thistle Docs

https://docs.thistle.tech/update/get_started/file_update

BeagleY-AI Quick Start — BeagleBoard Documentation

https://docs.beagleboard.org/boards/beagley/ai/02-quick-start.html

BeagleY-AI Quick Start — BeagleBoard Documentation

https://docs.beagleboard.org/boards/beagley/ai/02-quick-start.html

BeagleY-AI Quick Start — BeagleBoard Documentation

https://docs.beagleboard.org/boards/beagley/ai/02-quick-start.html

BeagleY-AI Quick Start — BeagleBoard Documentation

https://docs.beagleboard.org/boards/beagley/ai/02-quick-start.html

BeagleY-AI Quick Start — BeagleBoard Documentation

https://docs.beagleboard.org/boards/beagley/ai/02-quick-start.html

Downloads - Thistle Docs

https://docs.thistle.tech/binaries

Downloads - Thistle Docs

https://docs.thistle.tech/binaries

Command Line Tools - Thistle Docs

https://docs.thistle.tech/update/command_line_tools

Thistle OTA Update on Orange Pi Zero 3 - Thistle Docs

https://docs.thistle.tech/hardware/orange_pi/zero3_ota_ab_update

Thistle OTA Update on Orange Pi Zero 3 - Thistle Docs

https://docs.thistle.tech/hardware/orange_pi/zero3_ota_ab_update

Thistle OTA Update on Orange Pi Zero 3 - Thistle Docs

https://docs.thistle.tech/hardware/orange_pi/zero3_ota_ab_update

Thistle OTA Update on Orange Pi Zero 3 - Thistle Docs

https://docs.thistle.tech/hardware/orange_pi/zero3_ota_ab_update

Command Line Tools - Thistle Docs

https://docs.thistle.tech/update/command_line_tools

Using GPIO — BeagleBoard Documentation

https://docs.beagleboard.org/boards/beagley/ai/demos/using-gpio.html

Using GPIO — BeagleBoard Documentation

https://docs.beagleboard.org/boards/beagley/ai/demos/using-gpio.html

Thistle OTA Update on Orange Pi Zero 3 - Thistle Docs

https://docs.thistle.tech/hardware/orange_pi/zero3_ota_ab_update

File Update - Thistle Docs

https://docs.thistle.tech/update/get_started/file_update

File Update - Thistle Docs

https://docs.thistle.tech/update/get_started/file_update

File Update - Thistle Docs

https://docs.thistle.tech/update/get_started/file_update

Command Line Tools - Thistle Docs

https://docs.thistle.tech/update/command_line_tools

Command Line Tools - Thistle Docs

https://docs.thistle.tech/update/command_line_tools

Thistle OTA Update on Orange Pi Zero 3 - Thistle Docs

https://docs.thistle.tech/hardware/orange_pi/zero3_ota_ab_update

File Update - Thistle Docs

https://docs.thistle.tech/update/get_started/file_update

Using GPIO — BeagleBoard Documentation

https://docs.beagleboard.org/boards/beagley/ai/demos/using-gpio.html

Thistle OTA Update on Orange Pi Zero 3 - Thistle Docs

https://docs.thistle.tech/hardware/orange_pi/zero3_ota_ab_update

Thistle OTA Update on Orange Pi Zero 3 - Thistle Docs

https://docs.thistle.tech/hardware/orange_pi/zero3_ota_ab_update

Introduction — BeagleBoard Documentation

https://docs.beagleboard.org/boards/beagley/ai/01-introduction.html

File Update - Thistle Docs

https://docs.thistle.tech/update/get_started/file_update
All Sources

docs.beagleboard

