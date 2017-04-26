# Merge-After-Toll

2017 MCM Problem B

## Problem Description

​	Multi-lane divided limited-access toll highways use “ramp tolls” and “barrier tolls”to collect tolls from motorists. A ramp toll is a collection mechanism at anentrance or exit ramp to the highway and these do not concern us here. A barriertoll is a row of tollbooths placed across the highway, perpendicular to thedirection of traffic flow. There are usually (always) more tollbooths than there areincoming lanes of traffic (see former 2005 MCM Problem B). So when exiting thetollbooths in a barrier toll, vehicles must “fan in” from the larger number oftollbooth egress lanes to the smaller number of regular travel lanes. A toll plazais the area of the highway needed to facilitate the barrier toll, consisting of thefan-out area before the barrier toll, the toll barrier itself, and the fan-in area afterthe toll barrier. For example, a three-lane highway (one direction) may use 8tollbooths in a barrier toll. After paying toll, the vehicles continue on their journeyon a highway having the same number of lanes as had entered the toll plaza(three, in this example).

​	Consider a toll highway having L lanes of travel in each direction and a barrier tollcontaining B tollbooths (B > L) in each direction. Determine the shape, size, andmerging pattern of the area following the toll barrier in which vehicles fan in fromB tollbooth egress lanes down to L lanes of traffic. Important considerations toincorporate in your model include accident prevention, throughput (number ofvehicles per hour passing the point where the end of the plaza joins the Loutgoing traffic lanes), and cost (land and road construction are expensive). Inparticular, this problem does not ask for merely a performance analysis of anyparticular toll plaza design that may already be implemented. The point is todetermine if there are better solutions (shape, size, and merging pattern) thanany in common use.

​	Determine the performance of your solution in light and heavy traffic. How doesyour solution change as more autonomous (self-driving) vehicles are added tothe traffic mix? How is your solution affected by the proportions of conventional(human-staffed) tollbooths, exact-change (automated) tollbooths, and electronictoll collection booths (such as electronic toll collection via a transponder in thevehicle)?

## Simulation

​	This program simulates real-time car streams effected by more thanten factors, such as the speed of cars, acceleration of cars, time interval for a car to pay in a toll.