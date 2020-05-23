# OITS_3d
===================

This is created 3d visual representations of OITS https://github.com/AdamHibberd/OITS1_BB

And consumes data from OITS_UI https://github.com/JustinWingChungHui/OITS_UI

It uses ThreeJs and is written using VuJs and Typescript.  


# Deployment
- Make sure you have nodejs and npm installed
 - Install the vue cli (https://cli.vuejs.org/)
 - Clone this repository
 - Edit the `BaseApiUrl` property in `src/config.ts` so that it points to the OITS_UI site
 - From the command line run: `npm run-script build`
 - It should have created a 'dist' folder.
 - Copy the contents of the dist folder to somewhere to host the static website. 


# Credits
OITS was created by Adam Hibberd https://github.com/AdamHibberd

Planetary Textures have been used from https://www.solarsystemscope.com/textures/ under the 'Attribution 4.0 International Licence'

Asteroid glTF model has been used from https://sketchfab.com/Oziry under the 'Attribution 4.0 International Licence'

Pioneer glTF model has been used from https://sketchfab.com/NASA under the 'Attribution 4.0 International Licence'
