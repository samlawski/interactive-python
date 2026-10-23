#!/bin/bash

# Create directories
mkdir -p scavenger_hunt/garden/shed scavenger_hunt/garden/pond
mkdir -p scavenger_hunt/house/bathroom scavenger_hunt/house/living_room/library
mkdir -p scavenger_hunt/house/kitchen scavenger_hunt/house/bedroom/attic
mkdir -p scavenger_hunt/street

# Create and populate files
echo -e "Welcome!\nSomewhere in or around the house is a hidden treasure. Find it to win!\n\n- Navigate the different locations using 'cd'.\n- Check what's available at your current location with 'ls'.\n- Use 'cat' to look at the contents of files.\n- And if you get lost, you can view your current location with 'pwd'." > scavenger_hunt/start.txt

# Garden
echo "A large tree. You notice something shiny among the branches, but it's out of reach." > scavenger_hunt/garden/tree.txt
echo "A patch of colorful flowers next to the pond." > scavenger_hunt/garden/flower.txt
echo "You notice barely visible footprints leading towards the pond." > scavenger_hunt/garden/.footprints.txt
echo "Various gardening tools. Nothing of interest." > scavenger_hunt/garden/shed/tools.txt
echo "A rusty old key. It might open something important." > scavenger_hunt/garden/shed/rusty_key.txt
echo "A beautiful water lily floats on the pond." > scavenger_hunt/garden/pond/water_lily.txt
echo "Quack!" > scavenger_hunt/garden/pond/duck.txt
echo "Congratulations! You've found the hidden treasure, a large golden coin. The coin shows the number '342'." > scavenger_hunt/garden/pond/.treasure.txt

# House
echo "An old leather jacket hangs on the wardrobe. It does not appear to be special, though." > scavenger_hunt/house/wardrobe.txt
echo "A neatly folded towel. Nothing unusual here." > scavenger_hunt/house/bathroom/towel.txt
echo "A large mirror. You see your reflection, but no clues." > scavenger_hunt/house/bathroom/mirror.txt

# Living Room
echo "The living room holds a secret." > scavenger_hunt/house/living_room/library/note.txt
echo "Sometimes, the key to success is hidden within the ordinary." > scavenger_hunt/house/living_room/library/red_book.txt
echo "A dusty old book. It mentions that sometimes the most valuable secrets are hidden. Try using 'ls -a' to uncover what is concealed." > scavenger_hunt/house/living_room/library/dusty_book.txt
echo "A family photo. It brings back memories but offers no clues." > scavenger_hunt/house/living_room/library/family_photo.txt
echo "At first you didn't see it. But it's actually quite dusty around here." > scavenger_hunt/house/living_room/library/.dust.txt
echo "You've found a hidden note! Check the bedroom for a secret door." > scavenger_hunt/house/living_room/.note.txt
echo "A broken vase lies on the floor. Nothing interesting here." > scavenger_hunt/house/living_room/broken_vase.txt
echo "An old chair that creaks when you sit on it. Nothing hidden here." > scavenger_hunt/house/living_room/old_chair.txt

# Kitchen
echo "A collection of recipes. Delicious, but not helpful for your quest." > scavenger_hunt/house/kitchen/recipe_book.txt
echo "A cupboard full of dishes. Nothing of interest." > scavenger_hunt/house/kitchen/cupboard.txt

# Bedroom
echo "A beautiful painting. Behind it, you notice a small note." > scavenger_hunt/house/bedroom/painting.txt
echo "An old lamp. It casts eerie shadows." > scavenger_hunt/house/bedroom/lamp.txt
echo "A secret door. You can't open it. But it seems to lead into the garden." > scavenger_hunt/house/bedroom/.secret_door.txt
echo "The bed looks like it hasn't been used in a while." > scavenger_hunt/house/bedroom/bed.txt

# Attic
echo "A large spider web. It seems undisturbed." > scavenger_hunt/house/bedroom/attic/spider_web.txt
echo "A dusty mirror reflects your image. No clues here." > scavenger_hunt/house/bedroom/attic/dusty_mirror.txt
echo "A forgotten trunk. It's locked and remains a mystery." > scavenger_hunt/house/bedroom/attic/forgotten_trunk.txt
echo "An old map showing the layout of the house. It seems to point towards the garden." > scavenger_hunt/house/bedroom/attic/old_map.txt

# Street
echo "A small red car. It's relatively new but beyond that, there is nothing special about it." > scavenger_hunt/street/car.txt
echo "A large birch tree. There is a small hole further up in the tree. You're too small to look inside." > scavenger_hunt/street/tree.txt
echo "A sturdy circular metal hatch in the middle of the street. It's too heavy to move." > scavenger_hunt/street/manhole.txt
