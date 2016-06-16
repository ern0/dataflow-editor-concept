# Dataflow Editor Concept

Dataflow editor technical concept, using Raphaël.js/SVG

You can try it live: http://linkbroker.hu/ihome/editor/

## What is it ##

I want to select the best platform for a dataflow editor. 
If we choose browser-based GUI, Raphaël.js looks a good choice.

## Known issue ##

You can delete connection by starting a new connection from 
a pin, and if you go the same direction (+/- a small angle) with an 
existing one, it will be faded, which means "marked for deletion", then 
if you release the mouse button, it will be deleted. If there are more 
connections in the similar direction, the closest one will be selected -
it sounds a good idea, but if you're over a target pin, it's better 
to be select the connection which ends at the target pin you're right 
over, not the closest one.
