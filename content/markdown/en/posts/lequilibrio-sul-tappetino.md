---
title: Balance on the Mat
subtitle: An illustrated introduction to Lyapunov stability through four examples from yoga practice.
category: Essays
excerpt: What does it mean to keep your balance? A ball in a bowl, an inverted pendulum and four examples from yoga illustrate stability, energy, feedback and the geometry of state space.
---

> *sthira-sukham āsanam*  
> Let the asana be steady and comfortable.  
> Patañjali, Yogasūtra II.46

## A fall to begin with

Anyone who has learnt Śīrṣāsana remembers their first falls. For a few seconds the inverted body seems to hold steady. Then the tilt increases and the corrections cease to be enough. In Śavāsana the response can be quite different. Lift a relaxed arm slightly and it tends to fall back to the floor and come to rest (figure [1](articolo-lequilibrio-sul-tappetino.html#figura-01)). For the arm, we will consider only vertical movement up to contact with the floor.

Figure 1. Responses to a perturbation. Without corrections, the tilt in Śīrṣāsana tends to grow. In Śavāsana the relaxed arm falls back towards the floor.

Stability theory studies how a system responds to small disturbances. Aleksandr Mikhailovich Lyapunov laid its foundations in his 1892 thesis, *The General Problem of the Stability of Motion*. His method can establish whether a motion remains close to an equilibrium without first working out its entire trajectory.

A ball resting at the bottom of a bowl and one perched on a hilltop respond differently to a small displacement, because the shape of the surface determines the forces that act as the ball moves. This difference gives us a way to identify the conditions under which the ball stays close to equilibrium or moves away. When we turn to the body, we must also account for the muscular corrections that allow us to sustain an asana as our points of support, weight distribution and inclination change.

**Diagram key**

Blue: motion. Green: energy. Red: equilibria and boundaries. Ochre: disturbances and corrections.


## Coming back to rest

**The ball.** With friction, a ball in a bowl comes to rest at its lowest point after a few oscillations. Move it a little and let go, and it rolls down, crosses the bottom and climbs the opposite side. It loses some of its mechanical energy on each pass, and the oscillations diminish until the ball stops.

A ball at rest at the bottom is in *equilibrium*. A small disturbance makes it oscillate nearby, so the equilibrium is *stable*. Friction also brings it back to the bottom, a further property known as *asymptotic stability*.

**The body.** A relaxed arm in Śavāsana provides another example of a return to rest. Lift it slightly and it falls back, coming to rest on contact with the floor, perhaps after a small bounce (figure [2](articolo-lequilibrio-sul-tappetino.html#figura-02)).

Figure 2. A ball and an arm at four moments. The grey ball in the third drawing marks the initial height. The bounce of the arm is schematic.

The displacement from the point of rest changes sign as the ball crosses the bottom (figure [3](articolo-lequilibrio-sul-tappetino.html#figura-03)). The diminishing amplitude shows how the motion dies away. In the mechanical models without memory used here, position and velocity together make up the *state*. Given these two quantities and the forces involved, we can determine the subsequent motion. An initial change in position or velocity is a *perturbation*, which we will also call a push.

Figure 3. Displacement from the point of rest in a damped oscillator. The plot describes the ball’s return. For the arm, it illustrates the dying away of the motion, which is bounded by the floor.

**Stable equilibrium**

An equilibrium is a state that remains unchanged over time. It is stable if, for any prescribed tolerance, a sufficiently close initial state keeps the motion within that tolerance. If the motion also converges to the equilibrium, the stability is asymptotic.


## The landscape

**The ball.** Moving a ball from the bottom of the bowl to its rim requires work against gravity. The system gains *gravitational potential energy*, which can turn into motion when the ball is released. For a given mass, higher elevation means greater potential energy.

Let us draw potential energy as a landscape (figure [4](articolo-lequilibrio-sul-tappetino.html#figura-04)). A ball released from rest on the side of a valley starts down towards the bottom. If it already has some velocity, it may climb instead. At the bottom, a small displacement costs energy and the force acts back towards equilibrium. On a hilltop, a displacement lowers the energy and the force acts away from the summit. A ball placed at rest on flat ground stays where it is, with no force drawing it back to any particular point.

Figure 4. Three potential energy profiles. The arrows on the slopes show the initial direction of motion after displacement from rest. On the flat section there is no restoring force towards any particular point.

**The body.** The body’s gravitational potential energy depends on the height of its *centre of mass*. In a uniform gravitational field, the total weight acts as though it were applied at that point. When standing, the centre of mass lies roughly in the pelvic region and shifts as the limbs move (figure [5](articolo-lequilibrio-sul-tappetino.html#figura-05)).

Figure 5. Centre of mass and base of support in four asanas. The ochre strip shows the base in cross-section. For static equilibrium with support from the floor alone, the vertical line through the centre of mass must fall within the base. Whether an already moving body can recover also depends on its motion and control.

A hanging pendulum and an inverted pendulum respond differently to the same tilt. The hanging pendulum’s centre of mass lies below the pivot and rises as the pendulum moves away from the vertical. The inverted pendulum’s centre of mass lies above the pivot and falls as it tilts (figure [6](articolo-lequilibrio-sul-tappetino.html#figura-06)).

Figure 6. A displacement raises the centre of mass of a suspended object and lowers that of an object pivoted below its centre of mass. The open circle marks the starting position.

The hanging pendulum therefore has a minimum of potential energy at rest, while the inverted pendulum has a maximum. Lifting the arm in Śavāsana increases its potential energy, and releasing it brings it back towards the floor. An inverted body, modelled as an inverted pendulum with no corrections, moves away from the vertical (figure [7](articolo-lequilibrio-sul-tappetino.html#figura-07)).

Figure 7. Schematic landscapes for the return of the arm in Śavāsana and the tilt of the uncorrected inverted pendulum associated with Śīrṣāsana.

A body can move forwards and backwards or from side to side. With two directions of displacement, the energy landscape becomes a surface, like the terrain on a relief map. The valley becomes a bowl and the summit a dome (figure [8](articolo-lequilibrio-sul-tappetino.html#figura-08)).

Figure 8. With two directions of displacement the landscape becomes a surface. Red marks the equilibrium, grey the displaced ball and blue its path.

**Potential energy**

Energy associated with the configuration of a system. In the gravitational examples it depends on height. Lifting a mass increases its potential energy. A local minimum of the potential marks a position towards which the force acts from nearby points.


## The altimeter

**The ball.** Gravity pulls the ball towards the bottom. The ball still has to dissipate energy before it can come to rest. As the ball descends, potential energy becomes kinetic energy.

*Kinetic energy* depends on mass and the square of speed. The ball moves quickly at the bottom of the bowl, then slows on the way up as it regains potential energy. Without dissipation the exchange would continue, and the ball would reach its starting height each time.

Friction transfers some mechanical energy into the internal energy of the ball and the bowl. Under the conditions of the experiment, this energy disperses as heat and is unavailable to the oscillation. Each climb ends lower than the last (figure [9](articolo-lequilibrio-sul-tappetino.html#figura-09)).

Figure 9. Five successive climbs of a ball in a bowl with friction, alternating from side to side. Each climb ends lower than the last.

The bars in figure [10](articolo-lequilibrio-sul-tappetino.html#figura-10) show potential energy, kinetic energy and energy dissipated as heat. The sum of the first two decreases. The third shows how much has been dissipated since the start.

Figure 10. The ball’s energy balance at four moments. Potential energy is associated with height and kinetic energy with motion.

The sum of potential and kinetic energy cannot increase during free motion. Energy passes between the two forms while friction dissipates part of it (figure [11](articolo-lequilibrio-sul-tappetino.html#figura-11)). With viscous friction the rate of loss is higher when the ball is moving faster. At each turning point the velocity is zero and the energy curve has a horizontal tangent, giving the steps rounded edges and no flat stretches of finite duration.

Figure 11. Position and total energy of the damped oscillator. Energy never increases, and the slope vanishes at each turning point.

A hiker who always follows a downhill path cannot reach a point higher than the one they started from, even if the path circles the valley (figure [12](articolo-lequilibrio-sul-tappetino.html#figura-12)). This restricts the region they can reach. To conclude that they will make it to the valley floor, we also have to rule out their stopping or approaching some higher elevation indefinitely.

Figure 12. A downhill path and its elevation. Green contours connect points at the same height. The path approaches the valley floor at 1,000 metres.

Lyapunov’s method looks for a quantity with similar properties. It is zero at equilibrium, positive at neighbouring states distinct from it, and never increases along a trajectory. If it is continuous, its level sets can enclose regions around the equilibrium that the system cannot leave. This gives a bound without tracing every point of the motion. A strict decrease away from equilibrium establishes convergence under the assumptions below.

We call this quantity a *Lyapunov function*, or an altimeter in the examples that follow. Mechanical energy is one example. In a population model or a control system, we can construct a function for the purpose, with no need for it to measure physical energy or exact distance from equilibrium.

**The body.** Energy supplied to raise a relaxed arm becomes kinetic energy as it falls and is dissipated in the tissues and on contact with the floor (figure [13](articolo-lequilibrio-sul-tappetino.html#figura-13)). This explains why the arm comes to rest.

Figure 13. The arm falls back in Śavāsana, with its energy balance shown at each stage. The sum of the first two bars gives the altimeter, which never increases.

**Stability conditions**

For an autonomous system $\dot{x} = f(x)$, with $f$ locally Lipschitz and $f\left( x^{*} \right) = 0$, let $V$ be continuously differentiable in a neighbourhood of the equilibrium. The equilibrium is stable if $$V\left( x^{*} \right) = 0,\qquad V(x) > 0\ \text{for}\ x \neq x^{*},\qquad\dot{V}(x) \leq 0.$$ If $\dot{V} < 0$ at every state in that neighbourhood except $x^{*}$, the equilibrium is asymptotically stable. When $\dot{V} \leq 0$, LaSalle’s invariance principle gives convergence if, in a compact positively invariant set, the equilibrium is the only trajectory that remains in $\{\dot{V} = 0\}$ for all time. For the oscillator $\ddot{q} + c\dot{q} + kq = 0$, with $c,k > 0$, take $V = \left( {\dot{q}}^{2} + kq^{2} \right)/2$, which gives $\dot{V} = -c{\dot{q}}^{2}$. Away from the origin, the zeros of $\dot{V}$ occur at isolated instants. For a conservative mechanical system, the Lagrange–Dirichlet theorem gives stability at a strict local minimum of the potential.


**Lyapunov function**

A smooth function of the state that vanishes at equilibrium, is positive at other nearby states and never increases along the motion. Its existence establishes local stability. Proving convergence requires an additional condition on decrease or invariance.


## Staying close

**The ball.** In a frictionless bowl, a ball displaced from the bottom and released oscillates indefinitely. Its energy stays constant and confines the motion (figure [14](articolo-lequilibrio-sul-tappetino.html#figura-14)). The bottom is still a stable equilibrium, even though nearby trajectories do not converge to it.

Figure 14. Displacement of the ball from the bottom. With friction, oscillations die out. Without friction, their amplitude stays constant.

The same bowl can thus give rise to motion that dies away or to persistent oscillations, depending on whether energy is dissipated.

Given a tolerance $\varepsilon$ around the equilibrium, we seek a bound $\delta$ on the initial perturbation that keeps the state within that tolerance throughout the motion. Stability requires that such a bound exist for every positive tolerance, however small (figure [15](articolo-lequilibrio-sul-tappetino.html#figura-15)). In the diagram the ball starts from rest, so it is enough to bound the displacement. For a general initial state we also need to account for velocity.

Figure 15. Tolerance and initial displacement for a ball released from rest. For each tolerance ε, we seek a bound δ on the initial displacement. Distances are measured from the bottom.

The bowl in figure [16](articolo-lequilibrio-sul-tappetino.html#figura-16) has a rim. A ball that starts inside with total energy below the potential at the rim is confined to the bowl. With higher energy it may cross the rim. When friction is present, the initial states from which the ball converges to the bottom form its *basin of attraction*. Without friction the confined ball continues to oscillate, so that region of confined motion does not qualify as a basin of attraction. Stability is a local property. In some systems it extends to perturbations of arbitrary size.

Figure 16. A bowl with a rim. The surface at left shows the dashed rim and the path of a ball that stays inside. At right is a cross-section of the same bowl.

**The body.** In Utthita Hasta Pādāṅguṣṭhāsana, one foot supports the body while the other leg extends forwards and the hand holds the big toe. Small oscillations occur while holding the asana. A force platform can track the centre of pressure, the point on the support plane where the resultant contact force acts. Figure [17](articolo-lequilibrio-sul-tappetino.html#figura-17) illustrates this with a schematic trace.

Figure 17. Utthita Hasta Pādāṅguṣṭhāsana and a synthetic centre-of-pressure trace seen from above. The circles and path are illustrative. A finite recording of this quantity alone cannot establish stability of the full state.

The trace shows how the point of application of the contact force moves over the observed interval. Whether the body recovers its balance also depends on its velocity, the motion of the limbs and the muscular corrections available.

The body continually experiences disturbances, including those associated with breathing, and compensates for them through postural control.

**Stability and invariant regions**

For a state $x(t)$ and an equilibrium $x^{*}$, stability takes the form $$\begin{matrix}
{\forall\,\varepsilon > 0\ \ \exists\,\delta > 0:\qquad \parallel x(0) - x^{*} \parallel < \delta} \\
\left. \Rightarrow\quad \parallel x(t) - x^{*} \parallel < \varepsilon\quad{\text{for all}\mspace{6mu}}t \geq 0. \right.
\end{matrix}$$ A compact sublevel set of $V$ contained in the region where $\dot{V} \leq 0$ is positively invariant. Any trajectory starting inside stays inside. The set gives an inner estimate of the basin of attraction once convergence to equilibrium has also been established, for example by LaSalle’s principle.


**Basin of attraction**

The set of initial states whose trajectories converge to a given equilibrium. Both position and velocity can determine whether a state belongs to the basin.


## The summit

**The ball.** A ball can remain at rest exactly on an ideal hilltop. A small displacement puts it on a slope that takes it farther away. Close to a rounded summit, the force grows approximately in proportion to the displacement.

The linear model therefore admits an *exponentially growing* motion, in which the displacement doubles at equal intervals (figure [18](articolo-lequilibrio-sul-tappetino.html#figura-18)). That exact behaviour requires a particular initial velocity. If the ball starts from rest, the growth is slower at first and later approaches exponential growth. The linear approximation holds near the summit.

Figure 18. The exponentially growing mode near the summit. The displacement doubles at equal time intervals. The drawing exaggerates the motion so it is visible.

**The body.** An *inverted pendulum* can model the tilt in Śīrṣāsana in the absence of corrections. It consists of an ideal massless rod with a mass concentrated at the top (figure [19](articolo-lequilibrio-sul-tappetino.html#figura-19)). At rest in the vertical position, gravity exerts no torque about the pivot. A small tilt produces a torque that increases it.

Figure 19. Śīrṣāsana and its simplest model, the inverted pendulum, with a rod pivoted at the base and a mass at the top.

Take a simple inverted pendulum 0.8 metres long, initially at rest and one degree from vertical. The linear model predicts about 1.3 degrees after two tenths of a second and 16.6 degrees after one second (figures [20](articolo-lequilibrio-sul-tappetino.html#figura-20) and [21](articolo-lequilibrio-sul-tappetino.html#figura-21)). The growing exponential mode doubles in about two tenths of a second. Motion from rest approaches that rate as it develops.

Figure 20. A simple inverted pendulum 0.8 metres long, initially at rest one degree from vertical. The rounded angles are calculated from the linear model at intervals of 0.2 seconds.

Figure 21. Growth of the tilt in the linear model, starting from rest. The doubling rate approaches that of the growing exponential mode.

These numbers show the timescale of the model. In a person, mass is distributed across a body with several joints. The linear approximation itself also loses accuracy as the angle increases.

**Equations of the inverted pendulum**

For the simple inverted pendulum at small angles, $\ddot{\theta} = \left( g/\ell \right)\theta$. With $\tau = \sqrt{\ell/g}$, the solution is $\theta(t) = \theta_{0}\cosh(t/\tau) + \tau\omega_{0}\sinh(t/\tau)$. Taking $\omega_{0} = 0$ gives the growth plotted in the figures. The pure mode $\theta_{0}e^{t/\tau}$ requires $\omega_{0} = \theta_{0}/\tau$ and doubles every $\tau\ln 2$. With $g = 9.81$ m/s$^{2}$ and $\ell = 0.8$ m, $\tau \approx 0.286$ s. For a rigid body of mass $m$, with centre of mass a distance $\ell$ from the pivot and moment of inertia $I$, the equation is $\ddot{\theta} = \left( mg\ell/I \right)\theta$.


**Unstable equilibrium**

An equilibrium is unstable if arbitrarily small perturbations can take the system beyond some fixed distance from it. The hilltop and the upright position of the uncorrected inverted pendulum are examples.


## Making corrections

**The stick.** Balancing a stick upright on the palm makes it easy to see how an inverted pendulum can be corrected. When it leans to one side, the hand moves in that direction, underneath the centre of mass and, if necessary, past it. The stick falls more slowly and can straighten up. If it swings the other way, the hand corrects again (figure [22](articolo-lequilibrio-sul-tappetino.html#figura-22)).

Figure 22. A stick balanced on the palm at three moments. The dashed line drops vertically from the top of the stick. The ochre arrow shows how the hand moves.

The observed tilt guides the movement of the hand, which in turn changes the tilt. This use of the effect of an action to guide the next action is called *feedback*.

For rods of the same shape, greater length slows the growth of the tilt and gives the hand more time to respond. In the uniform-rod model, the growing mode doubles in about 0.18 seconds for a one-metre rod and in about 0.07 seconds for a 15-centimetre pencil (figure [23](articolo-lequilibrio-sul-tappetino.html#figura-23)).

Figure 23. A longer rod tilts more slowly in this model, leaving more time to correct it.

**The body.** In Śīrṣāsana the points of contact with the floor stay nearly fixed. The body redistributes forces within the base of support and changes its configuration through movements of the shoulders, trunk and limbs. Figure [24](articolo-lequilibrio-sul-tappetino.html#figura-24) represents their combined effect as a corrective torque at the base.

Figure 24. Śīrṣāsana with correction. Weight tends to increase the tilt, denoted by the Greek letter θ (theta). The correction at the base tends to reduce it.

In the simplest model the correction grows in proportion to the tilt and acts towards the vertical. We can picture it as a bowl added to the gravitational hill. If the restoring action outweighs the destabilising effect of gravity, their sum has a minimum (figure [25](articolo-lequilibrio-sul-tappetino.html#figura-25)). The resulting *effective potential* describes the restoring term of the controlled system (figure [26](articolo-lequilibrio-sul-tappetino.html#figura-26)). The energy used by the muscles is a separate quantity.

Figure 25. Adding the gravitational potential and the correction term. Sufficient restoring action produces a minimum. With a weaker correction the maximum remains. The diagram assumes there is no delay.

Figure 26. The effective potential with correction is green, and the original unstable potential is grey. The blue path shows a damped return in two position coordinates. Height represents potential energy alone, which can increase during the oscillations.

A further correction proportional to velocity can damp the oscillations. In the model without delay, the sum of kinetic energy and effective potential gives an altimeter that never increases. The potential itself can increase on an uphill stretch, just as it does for a ball climbing the side of its bowl.

Figure [27](articolo-lequilibrio-sul-tappetino.html#figura-27) shows the feedback loop through sensing, processing and muscular response.

Figure 27. The feedback loop that sustains Śīrṣāsana.

The loop introduces a delay. In a study of people standing upright, Horak and Nashner measured muscular responses to disturbances of the support surface with latencies of 73 to 110 milliseconds.[^1] In the growing exponential mode of the 0.8-metre pendulum, a tenth of a second is enough for the tilt to increase by about 42%. The state may therefore have changed considerably by the time the correction arrives.

The simulations in figure [28](articolo-lequilibrio-sul-tappetino.html#figura-28) show what a delay does to a controller whose output is proportional to position and velocity. With the chosen parameters, a short delay allows the pendulum to recover. As the delay increases, oscillations last longer or grow. For a fixed delay, too strong a correction can also destabilise the system. The coefficients governing the strength of the correction are called gains. The parameters and threshold are illustrative values for the numerical model.

Figure 28. Four responses of the inverted pendulum with delayed control. The red line shows an illustrative amplitude threshold. The cross marks the first crossing. The equation, parameters and initial history are given in the model notes.

The inverted pendulum can also describe some of the sway that occurs during standing. In the body, several joints contribute to the response. In Utthita Hasta Pādāṅguṣṭhāsana, the narrow base of support limits some corrections, and the extent of the basin of attraction depends on other factors as well.

**Feedback control**

In the linear model of the simple pendulum, a correction $u = -k_{p}\theta - k_{d}\dot{\theta}$ gives $$\ddot{\theta} = \left( \frac{g}{\ell} - k_{p} \right)\theta - k_{d}\,\dot{\theta}.$$ If $k_{p} > g/\ell$ and $k_{d} > 0$, the function $$V = \frac{1}{2}\,{\dot{\theta}}^{2} + \frac{1}{2}\left( k_{p} - \frac{g}{\ell} \right)\theta^{2},\qquad\dot{V} = -k_{d}\,{\dot{\theta}}^{2} \leq 0$$ is positive away from the origin and never increases. LaSalle’s principle gives convergence because the equilibrium is the only motion that can remain in $\{\dot{\theta} = 0\}$. Asymptotic stability here applies to the model without delay. For a uniform rod of length $L$, $\tau = \sqrt{2L/(3g)}$. Figure [23](articolo-lequilibrio-sul-tappetino.html#figura-23) compares the timescales of the growing modes for two rods.


**Feedback**

The use of a measurement of the state or the effect of an action to adjust the action itself. Feedback can stabilise an equilibrium, depending on the control law, its limits and the delay.


## Two valleys

**The ball.** Two wells separated by a rise have two stable equilibria. With friction, a small disturbance around the bottom of either well dies away. A stronger push can send the ball over the rise (figure [29](articolo-lequilibrio-sul-tappetino.html#figura-29)), and it may cross several times before coming to rest. The well in which it settles depends on both its initial position and its initial velocity.

Figure 29. Two wells and a rise. The ochre arrow marks the push. The dashed path follows a weak push and the solid path a stronger one.

**The body.** In a dropback, the practitioner moves from Samasthiti to Ūrdhva Dhanurāsana and then rises back up (figure [30](articolo-lequilibrio-sul-tappetino.html#figura-30)). We can represent the two held asanas as wells in an effective potential landscape. The rise between them represents the part of the movement where the body’s configuration and muscular action change (figure [31](articolo-lequilibrio-sul-tappetino.html#figura-31)). How the transition unfolds depends on the body’s configuration, velocity and the control exerted throughout the movement.

Figure 30. Four stages of the dropback and their schematic representation on a double-well landscape. The rise marks the transition between asanas.

Figure 31. The effective potential landscape used for the dropback. The arrows show both directions of travel. The outcome depends on motion and corrections as well as configuration.

In the dynamical model, the boundary between the two basins is called a *separatrix*. It lies in state space, which includes velocity. A free trajectory stays on its side of the boundary as long as the dynamics remain fixed. An external action or a change in control can move the system from one basin to another. In a dropback, the practitioner actively adjusts the movement during the transition.

The effective potential captures the restoring action of the model. Muscular action can also supply or dissipate energy. With two position coordinates, the rise appears as a pass between two wells (figure [32](articolo-lequilibrio-sul-tappetino.html#figura-32)). The ridge visible on the potential surface generally differs from the separatrix in state space.

Figure 32. A double-well potential associated with the two asanas. The open circle marks the pass and the dashed line the ridge. The blue trajectory crosses the rise and settles in the right-hand well. Height represents potential energy, which can rise even as total energy falls.

To rise back up, the model requires enough energy to clear the potential barrier as well as to cover what is dissipated along the way (figure [33](articolo-lequilibrio-sul-tappetino.html#figura-33)). After crossing the rise, the practitioner must slow down to come to rest in Samasthiti. This final part of the ascent also requires control.

Figure 33. The passage from the right-hand well to the left-hand one. The height difference in green is the potential barrier. The energy supplied must also cover losses along the way.

The double well is a model of *bistability*. It lets us study which disturbances change the outcome of the motion and which actions move the system from one stable state to the other.

**Separatrix**

An invariant boundary between families of trajectories with different behaviour. In the damped double well it divides the basins of the two equilibria. In the conservative bowl it separates oscillations contained within the rim from trajectories that can escape.


## One step further: mapping the states

**The state.** Two pendulums are at their lowest point. One is at rest and the other is passing through at speed (figure [34](articolo-lequilibrio-sul-tappetino.html#figura-34)). To predict how each will move, we need both position and velocity. A state diagram lets us plot the two together.

Figure 34. Two pendulums at the same position with different subsequent motions.

**The diagram.** Plot position horizontally and velocity vertically. Each point represents a state (figure [35](articolo-lequilibrio-sul-tappetino.html#figura-35)). Positive positions appear on the right and motion towards the right in the upper half. The origin represents the pendulum at rest at its lowest point. This plane is the *phase plane*, a map of the possible states.

Figure 35. How to read the phase plane. In each quadrant an icon shows position as a dot relative to the red equilibrium mark, and velocity as a blue arrow.

**The trajectory.** As the pendulum oscillates, its state changes and the point moves across the plane. The curve it traces is the *trajectory*. We can construct it frame by frame (figure [36](articolo-lequilibrio-sul-tappetino.html#figura-36)). In frame 1 the pendulum is at rest at the rightmost extreme: position is at its maximum, velocity is zero and the point lies to the right on the horizontal axis. In frame 3 the pendulum passes through the centre at its maximum speed to the left, and the point is at the bottom. In frame 5 the pendulum is briefly at rest at the leftmost extreme. In frame 7 it crosses the centre again, moving to the right, before returning to its starting state.

Figure 36. A frictionless pendulum frame by frame, with velocity in blue above and the corresponding states on the phase plane below. The numbered points trace a clockwise loop.

Without friction, a small oscillation repeats and the trajectory forms a *closed orbit*. With moderate damping the amplitude decreases, and the curve spirals towards equilibrium (figure [37](articolo-lequilibrio-sul-tappetino.html#figura-37)). If the damping is strong, the pendulum can return without oscillating.

Figure 37. A pendulum with friction. Position against time is on the left and the phase plane is on the right. Matching numbers mark the same moments.

**The altimeter on the phase plane.** For the linear oscillator, total energy assigns a height to every pair of position and velocity values. Its level curves are ellipses. With a suitable choice of units on the two axes, they become circles, as in figure [38](articolo-lequilibrio-sul-tappetino.html#figura-38). Without friction the trajectory stays on a single level. With friction it moves to lower levels, though it can be tangent to a level curve at a turning point.

Figure 38. Levels of total energy and the trajectory of a damped oscillator. Height never increases along the blue path.

Lifting each state to the height given by its total energy produces the bowl in figure [39](articolo-lequilibrio-sul-tappetino.html#figura-39). The base coordinates are now position and velocity. Earlier landscapes plotted potential energy against position alone.

Figure 39. The spiral in three dimensions. The light-blue curve below is the trajectory in the phase plane. Above it, the raised altimeter surface shows the trajectory descending towards the bottom. Dashed lines connect selected points to their projections on the plane.

**The asanas on the phase plane.** The damped oscillator used to illustrate a return to rest in Śavāsana produces the spirals in figure [40](articolo-lequilibrio-sul-tappetino.html#figura-40). The same dynamics underlie both views.

Figure 40. The damped oscillator used to illustrate a return to rest. At left, a trajectory lifted to the height given by its total energy. At right, four trajectories in the position–velocity plane. The lifted trajectory starts on the right with zero velocity.

In the conservative model of the bowl with a rim, small oscillations form closed orbits around the centre (figure [41](articolo-lequilibrio-sul-tappetino.html#figura-41)). The red curves are separatrices delimiting the region of oscillations inside the bowl. On the boundary, motion approaches an unstable equilibrium on the rim asymptotically, taking infinitely long to reach it.

Figure 41. A bowl with a rim in the conservative model associated with balancing on one leg. The origin is stable without being attracting. The restoring action is idealised. Holding the asana requires muscular control.

Without corrections, the inverted pendulum has a saddle equilibrium. In figure [42](articolo-lequilibrio-sul-tappetino.html#figura-42), the states that converge to the upright position lie on a single line, marked with two inward arrows. The line crossing it gives the unstable direction. All other states move away in the linear model, even if they start arbitrarily close. With a suitable controller the origin becomes asymptotically stable, and the coefficients chosen for the figure produce a spiralling return.

Figure 42. Śīrṣāsana in the phase plane, without correction at left and with correction at right.

A damped double well has two attracting equilibria. Figure [43](articolo-lequilibrio-sul-tappetino.html#figura-43) colours each initial state according to the equilibrium it reaches. The red curve is the stable manifold of the central saddle and separates the two basins. The regions wind around one another because a trajectory with enough energy can cross the rise several times before settling. Close to the boundary, small changes in the initial state change the final destination.

Figure 43. Basins of the double-well model. Blue marks the left equilibrium and ochre the right one. The asanas illustrate the association qualitatively. The open circle marks the saddle. States on the boundary converge to the saddle, while the two minima attract states in their respective basins. The colours approximate the basins on a finite grid.

An equilibrium around which trajectories spiral is called a *focus*. An equilibrium surrounded by closed orbits is a *centre*. A *saddle* has attracting and repelling directions.

**State, diagram, trajectory, orbit**

In the mechanical model with one degree of freedom, the state consists of position and velocity. The phase plane represents states as points, and a trajectory traces their evolution over time. A closed orbit corresponds to periodic motion.


## Summary and limits

Figure [44](articolo-lequilibrio-sul-tappetino.html#figura-44) brings together the models discussed above. The landscape represents potential energy, including the effective potential where appropriate. The phase portrait also accounts for velocity.

Figure 44. Models associated with the asanas, showing their potentials, phase portraits and types of equilibrium. Each classification applies under the conditions of the specified model.

The body has many degrees of freedom, changing points of contact and a controller whose response can depend on its recent history. The models isolate a few movements to make the underlying dynamics easier to follow. In particular, a delay requires the state to include the recent history of the system.[^2] A Lyapunov function with the required properties establishes stability. An unsuccessful search leaves the question open.

A correction can be so strong that it feeds the very oscillation it is meant to stop. For some parameters of the inverted pendulum model, this happens when the response arrives late, acting on a tilt that has already changed. Both the strength and timing of the intervention matter. Exerting more effort can make it harder to regain balance.

This brings me back to the loosening of effort in Yogasūtra II.47, *prayatna-śaithilya-ananta-samāpattibhyām*. What interests me is that practising an asana involves learning how much effort it takes to sustain the shape, and how much can be let go.

## Glossary

Altimeter.  
The name used here for a Lyapunov function.

Basin of attraction.  
The set of initial states whose trajectories converge to a given equilibrium.

Base of support.  
The region of the support plane enclosed by the points of contact in the static model considered here.

Centre of mass.  
The mean position of a body’s constituent masses, weighted by mass. In uniform gravity, the resultant weight acts at this point.

Kinetic energy.  
Energy associated with motion. For a point mass, it is proportional to the square of speed.

Potential energy.  
Energy associated with configuration. In the gravitational examples, it increases with the height of the centre of mass.

Equilibrium.  
A state that remains unchanged. It is *stable* if sufficiently close initial states stay close, *asymptotically stable* if they also converge to it and *unstable* if the stability condition fails.

Lyapunov function.  
A smooth function that vanishes at equilibrium, is positive at other nearby states and never increases along the motion. Under the hypotheses given in the text, it establishes stability.

Phase plane.  
The diagram with position on the horizontal axis and velocity on the vertical axis. It represents the state space in these two-dimensional models.

Closed orbit.  
A trajectory that loops back on itself, so the motion repeats.

Inverted pendulum.  
A pendulum whose centre of mass is above the pivot. Its upright equilibrium is unstable without correction.

Effective potential.  
In the model used here, the gravitational potential plus the term that represents the restoring action of the controller. Muscular energy expenditure is a separate quantity.

Feedback.  
A mechanism that measures the effect of an action and uses it to adjust the next action.

Separatrix.  
An invariant boundary between trajectories with different behaviour. It can divide two basins of attraction or separate confined oscillations from escaping trajectories.

Push.  
Informal term for a perturbation of the initial state. Persistent disturbances require a separate analysis.

State.  
The information needed to determine how a system evolves, given its laws of motion. In the mechanical models without memory it consists of position and velocity. With delay, it also includes the recent history.

Trajectory.  
The curve the state traces through state space over time.

## Notes on the models and plots

The examples use dimensionless quantities, except for the pendulum in figures [20](articolo-lequilibrio-sul-tappetino.html#figura-20) and [21](articolo-lequilibrio-sul-tappetino.html#figura-21). The parameters illustrate mathematical behaviour. The body diagrams, energy bars and centre-of-pressure traces are schematic. The numerical coordinates and the tools used to export the figures are included in the site’s source package.

**Damped oscillations**

**Oscillations and the altimeter.** The phase portraits use $$\dot{q} = v,\qquad\dot{v} = -q - cv,\qquad V = \frac{1}{2}\left( q^{2} + v^{2} \right),\qquad\dot{V} = -cv^{2}.$$ Figure [39](articolo-lequilibrio-sul-tappetino.html#figura-39) uses $c = 0.24$, initial state $(1.8,0)$ and times from 0 to 25. The upper surface is at height $1.3 + V$, and the curve is offset slightly so that it remains visible. Figure [40](articolo-lequilibrio-sul-tappetino.html#figura-40) uses $c = 0.4$, initial states $(\pm 1.8,0)$ and $(0,\pm 1.8)$ and times from 0 to 24. The planar and raised curves come from the same analytical solution.

Figure [26](articolo-lequilibrio-sul-tappetino.html#figura-26) uses two independent position coordinates, each governed by $\ddot{q} + 0.5\dot{q} + 1.2q = 0$. The initial conditions are $\left( q_{1},q_{2},{\dot{q}}_{1},{\dot{q}}_{2} \right) = (1.5,0,0,0.7)$. The surface plots potential energy $0.6\left( q_{1}^{2} + q_{2}^{2} \right)$ alone. The monotonicity check uses total energy, including the kinetic term.


**A bowl with a rim**

The conservative phase portrait in figure [41](articolo-lequilibrio-sul-tappetino.html#figura-41) corresponds to $$\dot{q} = v,\qquad\dot{v} = -q + \frac{1}{2}q^{3},\qquad H = \frac{1}{2}v^{2} + \frac{1}{2}q^{2} - \frac{1}{8}q^{4}.$$ The centre is at $(0,0)$ and the saddles are at $\left( \pm\sqrt{2},0 \right)$. The separatrices belong to the level $H = 1/2$ and have equations $v = \pm\left( 1 - q^{2}/2 \right)$. The interior orbits are periodic and remain at their own energy levels. The other schematic landscapes show the shape of the potential in position coordinates.


**Basins of the double well**

The map in figure [43](articolo-lequilibrio-sul-tappetino.html#figura-43) uses $$\dot{q} = v,\qquad\dot{v} = q - q^{3} - 0.3v,\qquad E = \frac{1}{2}v^{2} + \frac{1}{4}\left( q^{2} - 1 \right)^{2}.$$ The 4,096 initial states form a $64 \times 64$ grid on the square $\lbrack-2,2\rbrack^{2}$. Fourth-order Runge–Kutta integration uses a step of $0.01$ and ends at $t = 120$. The colour depends on the well reached. For every point on this grid, the final state is within $10^{-7}$ of one of the two equilibria in both components.

The red curves approximate the stable manifold of the saddle. The integration starts at $\pm 10^{-5}\left( 1,\lambda_{s} \right)$, with $\lambda_{s} = \left( -0.3 - \sqrt{4.09} \right)/2$, and runs backwards with a step of $-0.001$. The coloured grid gives a finite-resolution approximation to the boundary.

For the surface in figure [32](articolo-lequilibrio-sul-tappetino.html#figura-32), add a coordinate $r$ governed by $\ddot{r} + 0.3\dot{r} + r = 0$. The surface is $U(q,r) = \frac{1}{4}\left( q^{2} - 1 \right)^{2} + \frac{1}{2}r^{2}$. The initial state is $\left( q,r,\dot{q},\dot{r} \right) = (-1,0.2,1.1,0.3)$. The integration runs to $t = 50$ with a step of $0.01$.


**Effects of delay**

Figure [28](articolo-lequilibrio-sul-tappetino.html#figura-28) uses $$\dot{q}(t) = v(t),\qquad\dot{v}(t) = q(t) - k_{p}q(t - d) - k_{d}v(t - d),$$ with constant history $q(t) = 0.1$, $v(t) = 0$ for $t \leq 0$. The four cases appear in this order: $$\begin{array}{lccc}
 & d & k_{p} & k_{d} \\
\text{short delay} & 0.05 & 2 & 1 \\
\text{medium delay} & 0.30 & 2 & 1 \\
\text{long delay} & 0.60 & 2 & 1 \\
\text{strong correction} & 0.30 & 8 & 2
\end{array}$$ The fourth-order Runge–Kutta integration runs to $t = 16$, with a step of $0.002$ and linear interpolation of the history. The illustrative threshold is $|q| = 0.45$. Halving the step changes the curves by less than $10^{-5}$ up to the first threshold crossing or the end of the plot. These finite-time simulations illustrate the response of the model. Stability itself requires a proof.


For the general results on Lyapunov functions, LaSalle’s principle and regions of attraction, see *Lyapunov Analysis* in Russ Tedrake’s MIT notes, *Underactuated Robotics* ([online chapter](https://underactuated.mit.edu/lyapunov.html)). The measurements of response delay are from F. B. Horak and L. M. Nashner, *Central programming of postural movements: adaptation to altered support-surface configurations*, Journal of Neurophysiology 55 (1986), 1369–1381, [doi:10.1152/jn.1986.55.6.1369](https://doi.org/10.1152/jn.1986.55.6.1369).

[^1]: F. B. Horak and L. M. Nashner, *Central programming of postural movements: adaptation to altered support-surface configurations*, Journal of Neurophysiology 55(6), 1369–1381, 1986, DOI: [10.1152/jn.1986.55.6.1369](https://doi.org/10.1152/jn.1986.55.6.1369). The measurements were taken during upright standing.

[^2]: Lyapunov–Krasovskii functionals extend the idea of the altimeter to a history of states.
