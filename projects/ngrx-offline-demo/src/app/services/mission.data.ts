import { Mission, MissionDetail } from '../interfaces/mission';


// https://nssdc.gsfc.nasa.gov/planetary/chronology.html

export const hardCodedMissionDetails: MissionDetail[] = [
    {
        uuid: '8a329d91-5e34-4b5f-a17f-9db10d493b13',
        name: 'Sputnik 1',
        celestialBody: 'Earth',
        launchDate: '4th October 1957',
        description: `The Sputnik 1 spacecraft was the first artificial satellite successfully placed in orbit around the Earth and was launched from Baikonur Cosmodrome at Tyuratam (370 km southwest of the small town of Baikonur) in Kazakhstan, then part of the former Soviet Union. The Russian word "Sputnik" means "companion" ("satellite" in the astronomical sense).

        In 1885 Konstantin Tsiolkovsky first described in his book, Dreams of Earth and Sky, how such a satellite could be launched into a low altitude orbit. It was the first in a series of four satellites as part of the Sputnik program of the former Soviet Union and was planned as a contribution to the International Geophysical Year (1957-1958). Three of these satellites (Sputnik 1, 2, and 3) reached Earth orbit.
        
        The Sputnik 1 satellite was a 58.0 cm-diameter aluminum sphere that carried four whip-like antennas that were 2.4-2.9 m long. The antennas looked like long "whiskers" pointing to one side. The spacecraft obtained data pertaining to the density of the upper layers of the atmosphere and the propagation of radio signals in the ionosphere. The instruments and electric power sources were housed in a sealed capsule and included transmitters operated at 20.005 and 40.002 MHz (about 15 and 7.5 m in wavelength), the emissions taking place in alternating groups of 0.3 s in duration. The downlink telemetry included data on temperatures inside and on the surface of the sphere.
        
        Since the sphere was filled with nitrogen under pressure, Sputnik 1 provided the first opportunity for meteoroid detection (no such events were reported), since losses in internal pressure due to meteoroid penetration of the outer surface would have been evident in the temperature data. The satellite transmitters operated for three weeks, until the on-board chemical batteries failed, and were monitored with intense interest around the world. The orbit of the then inactive satellite was later observed optically to decay 92 days after launch (January 4, 1958) after having completed about 1400 orbits of the Earth over a cumulative distance traveled of 70 million kilometers. The orbital apogee declined from 947 km after launch to 600 km by Dec. 9th.
        
        The Sputnik 1 rocket booster also reached Earth orbit and was visible from the ground at night as a first magnitude object, while the small but highly polished sphere, barely visible at sixth magnitude, was more difficult to follow optically. Several replicas of the Sputnik 1 satellite can be seen at museums in Russia and another is on display in the Smithsonian National Air and Space Museum in Washington, D.C.`,
        launchSite: 'Tyuratam (Baikonur Cosmodrome), U.S.S.R',
        mass: 83.6
    },
    {
        uuid: '9896b202-c6c5-4a01-b977-05e9fbb04c48',
        name: 'Sputnik 2',
        celestialBody: 'Earth',
        launchDate: '3rd November 1957',
        description: `Sputnik 2 was the second spacecraft launched into Earth orbit and was the first such biological spacecraft. It was a 4 meter high cone-shaped capsule with a base diameter of 2 meters. It contained several compartments for radio transmitters, a telemetry system, a programming unit, a regeneration and temperature control system for the cabin, and scientific instruments. A separate sealed cabin contained the experimental dog Laika. Engineering and biological data were transmitted using the Tral_D telemetry system, which would transmit data to Earth for 15 minutes of each orbit. Two spectrophotometers were on board for measuring solar radiation (ultraviolet and x-ray emissions) and cosmic rays. A television camera was mounted in the passenger compartment to observe Laika. The camera could transmit 100-line video frames at 10 frames/second.
        Mission Profile
        
        Sputnik 2 was launched on a Sapwood SS-6 8K71PS launch vehicle (essentially a modified R-7 ICBM similar to that used for Sputnik 1) to a 212 x 1660 km orbit with a period of 103.7 minutes. After reaching orbit the nose cone was jettisoned successfully but the Blok A core did not separate as planned. This inhibited the operation of the thermal control system. Additionally some of the thermal insulation tore loose so the interior temperatures reached 40 C. It is believed Laika survived for only about two days instead of the planned ten because of the heat. The orbit of Sputnik 2 decayed and it reentered Earth's atmosphere on 14 April 1958 after 162 days in orbit.
        Laika
        
        The first being to orbit the Earth was a female part-Samoyed terrier originally named Kudryavka (Little Curly) but later renamed Laika (Barker). She weighed about 6 kg. The pressurized cabin on Sputnik 2 allowed enough room for her to lie down or stand and was padded. An air regeneration system provided oxygen; food and water were dispensed in a gelatinized form. Laika was fitted with a harness, a bag to collect waste, and electrodes to monitor vital signs. The early telemetry indicated Laika was agitated but eating her food. There was no capability of returning a payload safely to Earth at this time, so it was planned that Laika would run out of oxygen after about 10 days of orbiting the Earth. Because of the thermal problems she probably only survived a day or two. The mission provided scientists with the first data on the behavior of a living organism orbiting in the space environment. `,
        launchSite: 'Tyuratam (Baikonur Cosmodrome), U.S.S.R',
        mass: 508.3
    },
    {
        uuid: 'a0addfb3-c4d0-4c3c-90d0-20fa5a2743df',
        name: 'Vanguard TV3',
        celestialBody: 'Earth',
        launchDate: '6th December 1957',
        description: `Vanguard Test Vehicle 3 (TV3) was the first U.S. attempt to launch a satellite into orbit around the Earth. It was a small satellite designed to test the launch capabilities of a three-stage launch vehicle and study the effects of the environment on a satellite and its systems in Earth orbit. It also was to be used to study micrometeor impacts and to obtain geodetic measurements through orbit analysis. The IGY Vanguard satellite program was designed with the purpose of launching one or more Earth orbiting satellites during the International Geophysical Year (IGY).

        At launch on 6 December 1957 at 16:44:34 UT at the Atlantic Missile Range in Cape Canaveral, Florida, the booster ignited and began to rise but about 2 seconds after liftoff, after rising about a meter, the rocket lost thrust and began to settle back down to the launch pad. As it settled against the launch pad the fuel tanks ruptured and exploded, destroying the rocket and severely damaging the launch pad. The Vanguard satellite was thrown clear and landed on the ground a short distance away with its transmitters still sending out a beacon signal. The satellite was damaged, however, and could not be reused. It is now on display at the Smithsonian Air and Space Museum.
        
        The exact cause of the accident was never determined, presumably it was due to a fuel leak between the fuel tank and the rocket engine, possibly due to a loose connection in a fuel line or low fuel pump inlet pressure allowing some of the burning fuel in the thrust chamber to leak back into the fuel tank.
        Spacecraft and Subsystems
        
        The spacecraft was an approximately 1.5-kg aluminum sphere 16.3 cm in diameter, nearly identical to the later Vanguard 1. A cylinder lined with heat shields mounted inside the sphere held the instrument payload. It contained a set of mercury-batteries, a 10-mW, 108-MHz telemetry transmitter powered by the batteries, and a 5-mW, 108.03-MHz Minitrack beacon transmitter, which was powered by six square (roughly 5 cm on a side) solar cells mounted on the body of the satellite. Six 30-cm long, 0.8-cm diameter spring-actuated aluminum alloy aerials protruded from the sphere. On actuation, the aerial axes were mutually perpendicular in lines that passed through the center of the sphere. The transmitters were primarily for engineering and tracking data, but were also to determine the total electron content between the satellite and ground stations. Vanguard also carried two thermistors which could measur the interior temperature in order to track the effectiveness of the thermal protection.
        
        A cylindrical separation device was designd to keep the sphere attached to the third stage prior to deployment. At deployment a strap holding the satellite in place would be released and three leaf springs would separate the satellite from the cylinder and third stage at a relative velocity of about 0.3 m/s.
        Launch Vehicle
        
        Vanguard was the designation used for both the launch vehicle and the satellite. The first stage of the three-stage Vanguard Test vehicle was powered by a GE X-405 28,000 pound (~125,000 N) thrust liquid rocket engine, propelled by 7200 kg of kerosene (RP-1) and liquid oxygen, with helium pressurant. It also held 152 kg of hydrogen peroxide. It was finless, 13.4 m (44 ft.) tall, 1.14 m (45 in.) in diameter, and had a launch mass of approximately 8090 kg (17,800 lbs. wt.).
        
        The second stage was a 5.8 m (19 ft.) high, 0.8 m (31.5 in.) diameter Aerojet-General AJ-10 liquid engine burning 1520 kg (3350 lbs) Unsymmetrical Dimethylhydrazine (UDMH) and White Inhibited Fuming Nitric Acid (WIFNA) with a helium pressurant tank. It produced a thrust of 7340 pounds (~32,600 N) and had a launch mass of approximately 1990 kg (4390 lbs. wt.). This stage contained the complete guidance and control system.
        
        A solid-propellant rocket with 2350 pounds (~ 10,400 N) of thrust (for 30 seconds burn time) was developed by the Grand Central Rocket Co. to satisfy third-stage requirements. The stage was 1.5 m (60 in.) high, 0.8 m (31.5 in.) in diameter, and had a launch mass of 194 kg (428 lbs.). The thin (0.076 cm, 0.03 in.) steel casing for the third stage had a hemispherical forward dome with a shaft at the center to support the satellite and an aft dome fairing into a steel exit nozzle.
        
        The total height of the vehicle with the satellite fairing was about 21.9 meters (72 feet). The payload capacity was 11.3 kg (25 lbs.) to a 555 km (345 mi.) Earth orbit. A nominal launch would have the first stage firing for 144 seconds, bringing the rocket to an altitude of 58 km (36 mi), followed by the second stage burn of 120 seconds to 480 km (300 mi), whereupon the third stage would bring the satellite to orbit. This was the same launch vehicle configuration, with minor modifications, as used all succeeding Vanguard flights up to and including Vanguard SLV-6.`,
        launchSite: 'Cape Canaveral, United States',
        mass: 1.5
    },
    {
        uuid: '178e60dc-adcc-43b7-b73f-d18d0c2282d5',
        name: 'Explorer 1',
        celestialBody: 'Earth',
        launchDate: '1st Febuary 1958',
        description: `Explorer 1 was the first successfully launched U. S. spacecraft. Launched late on 31 January 1958 (10:48 p.m. EST, or 03:48 UTC on 01 February) on an adapted Jupiter-C rocket, Explorer 1 carried instrumentation for the study of cosmic rays, micrometeorites, and for monitoring of the satellite's temperature.

        The Jupiter-C launch vehicle consisted of four propulsive stages. The first stage was an upgraded Redstone liquid-fueled rocket. The second, third, and fourth stage rockets consisted of eleven, three, and one (respectively) Sergeant motors. The satellite itself was the fourth stage of the Jupiter-C rocket. It was cylindrical, 2.03 m long and 0.152 m in diameter. Four whip antennas were mounted symmetrically about the mid-section of the rocket. The spacecraft was spin stabilized.
        
        The 4.82 kg instrumentation package was mounted inside of the forward section of the rocket body. A single Geiger-Mueller detector was used for the detection of cosmic rays. Micrometeorite detection was accomplished using both a wire grid (arrayed around the aft section of the rocket body) and an acoustic detector (placed in contact with the midsection). Data from the instruments were transmitted continuously, but acquisition was limited to those times when the spacecraft passed over appropriately equipped ground receiving stations. Assembly of data proceeded slowly also due to the fact that the satellite's spin-stabilized attitude transitioned into a minimum kinetic energy state, that of a flat spin about its transverse axis. This was deduced from the modulation of the received signal, which produced periodic fade-outs of the signal.
        
        Explorer 1 was the first spacecraft to successfully detect the durably trapped radiation in the Earth's magnetosphere, dubbed the Van Allen Radiation Belt (after the principal investigator of the cosmic ray experiment on Explorer 1, James A. Van Allen). Later missions (in both the Explorer and Pioneer series) were to expand on the knowledge and extent of these zones of radiation and were the foundation of modern magnetospheric studies.`,
        launchSite: 'Cape Canaveral, United States',
        mass: 13.97
    },
    {
        uuid: '5442a07c-5673-4fd9-8463-3d2473196225',
        name: 'Vanguard 1',
        celestialBody: 'Earth',
        launchDate: '17th March 1958',
        description: `anguard 1 (1958 Beta 2) was a small Earth-orbiting satellite designed to test the launch capabilities of a three-stage launch vehicle and the effects of the environment on a satellite and its systems in Earth orbit. It also was used to obtain geodetic measurements through orbit analysis. It was the second satellite launched by the U.S., the first successful satellite of the Vanguard series, and the first satellite to use solar cell power. It is the oldest satellite still orbiting the Earth.
        Mission Profile
        
        Vanguard 1 launched on 17 March 1958 at 12:15:41 UT from the Atlantic Missile Range in Cape Canaveral Florida. At 12:26:21, the third stage of the launch vehicle injected Vanguard 1 into a 654 x 3969 km, 134.27 minute orbit inclined at 34.25 degrees. Original estimates had the orbit lasting for 2000 years, but it was discovered that solar radiation pressure and atmospheric drag during high levels of solar activity produced significant perturbations in the perigee height of the satellite, which caused a significant decrease in its expected lifetime to only about 240 years. The battery powered transmitter stopped operating in June 1958 when the batteries ran down. The solar powered transmitter operated until May 1964 (when the last signals were received in Quito, Ecuador) after which the spacecraft was optically tracked from Earth.
        Spacecraft and Subsystems
        
        The spacecraft was a 1.46-kg aluminum sphere 16.5 cm in diameter. A cylinder lined with heat shields mounted inside the sphere held the instrument payload. It contained a set of mercury-batteries, a 10-mW, 108-MHz telemetry transmitter powered by the batteries, and a 5-mW, 108.03-MHz Minitrack beacon transmitter, which was powered by six square (roughly 5 cm on a side) solar cells mounted on the body of the satellite. The cells were single crystal silicon and produced a total of about 1 Watt with 10% efficiency at 28 C. Six 30-cm long, 0.8-cm diameter spring-actuated aluminum alloy aerials protruded from the sphere. The aerial axes were mutually perpendicular and passed through the center of the sphere. The transmitters were used primarily for engineering and tracking data, but were also used to determine the total electron content between the satellite and ground stations. Vanguard also carried two thermistors which measured the interior temperature over 16 days in order to track the effectiveness of the thermal protection.
        
        A cylindrical separation device kept the sphere attached to the third stage prior to deployment. At deployment a strap holding the satellite in place released and three leaf springs separated the satellite from the cylinder and third stage at a relative velocity of about 0.3 m/s.
        Launch Vehicle
        
        Vanguard was the designation used for both the launch vehicle and the satellite. The first stage of the three-stage Vanguard Test vehicle was powered by a GE X-405 28,000 pound (~125,000 N) thrust liquid rocket engine, propelled by 7200 kg of kerosene (RP-1) and liquid oxygen, with helium pressurant. It also held 152 kg of hydrogen peroxide. It was finless, 13.4 m (44 ft.) tall, 1.14 m (45 in.) in diameter, and had a launch mass of approximately 8090 kg (17,800 lbs. wt.).
        
        The second stage was a 5.8 m (19 ft.) high, 0.8 m (31.5 in.) diameter Aerojet-General AJ-10 liquid engine burning 1520 kg (3350 lbs) Unsymmetrical Dimethylhydrazine (UDMH) and White Inhibited Fuming Nitric Acid (WIFNA) with a helium pressurant tank. It produced a thrust of 7340 pounds (~32,600 N) and had a launch mass of approximately 1990 kg (4390 lbs. wt.). This stage contained the complete guidance and control system.
        
        A solid-propellant rocket with 2350 pounds (~ 10,400 N) of thrust (for 30 seconds burn time) was developed by the Grand Central Rocket Co. to satisfy third-stage requirements. The stage was 1.5 m (60 in.) high, 0.8 m (31.5 in.) in diameter, and had a launch mass of 194 kg (428 lbs.). The thin (0.076 cm, 0.03 in.) steel casing for the third stage had a hemispherical forward dome with a shaft at the center to support the satellite and an aft dome fairing into a steel exit nozzle.
        
        The total height of the vehicle with the satellite fairing was about 21.9 meters (72 feet). The payload capacity was 11.3 kg (25 lbs.) to a 555 km (345 mi.) Earth orbit. A nominal launch would have the first stage firing for 144 seconds, bringing the rocket to an altitude of 58 km (36 mi), followed by the second stage burn of 120 seconds to 480 km (300 mi), whereupon the third stage would bring the satellite to orbit. This was the same launch vehicle configuration, with minor modifications, as used for Vanguard TV-3 and all succeeding Vanguard flights up to and including Vanguard SLV-6.`,
        launchSite: 'Cape Canaveral, United States',
        mass: 1.46
    },
    {
        uuid: 'ead55c63-05a3-4819-89eb-60002649f8e8',
        name: 'Pioneer 0',
        celestialBody: 'Mars',
        launchDate: '17th August 1958',
        description: `This spacecraft was the first U.S. attempt at a lunar mission and the first attempted lauch beyond Earth orbit by any country. The Pioneer 0 probe was designed to go into orbit around the Moon and carried a TV camera and other instruments as part of the first International Geophysical Year (IGY) science payload. The spacecraft was destroyed by an explosion of the first (Thor booster no. 127) stage 77 seconds after launch at 16 km altitude, 16 km downrange over the Atlantic. Failure was suspected to be due to a ruptured fuel or oxygen line or a faulty turbopump gearbox. Erratic telemetry signals were received from the payload and upper stages for 123 seconds after the explosion, and the upper stages were tracked to impact in the ocean. The original plan was for the spacecraft to travel for 2.6 days to the Moon at which time a TX-8-6 solid propellant motor would fire to put it into a 29,000 km lunar orbit which was to nominally last for about two weeks.
        Spacecraft and Subsystems
        
        Pioneer 0 consisted of a thin cylindrical midsection with a squat truncated cone frustrum on each side. The cylinder was 74 cm in diameter and the height from the top of one cone to the top of the opposite cone was 76 cm. Along the axis of the spacecraft and protruding from the end of the lower cone was an 11 kg solid propellant injection rocket and rocket case, which formed the main structural member of the spacecraft. Eight small low-thrust solid propellant velocity adjustment rockets were mounted on the end of the upper cone in a ring assembly which could be jettisoned after use. A magnetic dipole antenna also protruded from the top of the upper cone. The shell was composed of laminated plastic and was painted with a pattern of dark and light stripes to help regulate temperature.
        
        The scientific instrument package had a mass of 11.3 kg and consisted of an image scanning infrared television system to study the Moon's surface, a diaphragm/microphone assembly to detect micrometeorites, a magnetometer, and temperature-variable resistors to record spacecraft internal conditions. The spacecraft was powered by nickel-cadmium batteries for ignition of the rockets, silver cell batteries for the television system, and mercury batteries for the remaining circuits. Radio transmission was at 108.06 MHz through an electric dipole antenna for telemetry and doppler information and a magnetic dipole antenna for the television system. Ground commands were received through the electric dipole antenna at 115 MHz. The spacecraft was to be spin stabilized at 1.8 rps, the spin direction approximately perpendicular to the geomagnetic meridian planes of the trajectory.`,
        launchSite: 'Cape Canaveral, United States',
        mass: 38.1
    },
    {
        uuid: 'd6a63ada-6e87-4e5f-8ba5-0d4f8b2cb250',
        name: 'Lunar 1958A',
        celestialBody: 'Moon',
        launchDate: '23rd September 1958',
        description: 'This early Luna launch was the first Soviet attempt to reach the Moon and impact on its surface, with a 156 kg Ye-1 probe. The SL-3/A-1 launch vehicle (a three stage R-7 rocket with a Block Ye upper stage) underwent a structural failure due to vibration caused by pressure oscillations in the BVGD boosters and exploded 92 seconds after launch.',
        launchSite: 'Soviet Union - Tyuratam (Baikonur Cosmodrome)',
        mass: null
    },
    {
        uuid: '5981fd9e-aa94-4fe5-a36d-2fb95732a7c1',
        name: 'Pioneer 1',
        celestialBody: 'Mars',
        launchDate: '11 October 1958',
        description: `Pioneer 1, the second and most successful of three project Able space probes and the first spacecraft launched by the newly formed NASA, was intended to study the ionizing radiation, cosmic rays, magnetic fields, and micrometeorites in the vicinity of the Earth and in lunar orbit. Due to a launch vehicle malfunction, the spacecraft attained only a ballistic trajectory and never reached the Moon. It did return data on the near-Earth space environment.
        Spacecraft and Subsystems
        
        Pioneer 1 consisted of a thin cylindrical midsection with a squat truncated cone frustrum on each side. The cylinder was 74 cm in diameter and the height from the top of one cone to the top of the opposite cone was 76 cm. Along the axis of the spacecraft and protruding from the end of the lower cone was an 11 kg solid propellant injection rocket and rocket case, which formed the main structural member of the spacecraft. Eight small low-thrust solid propellant velocity adjustment rockets were mounted on the end of the upper cone in a ring assembly which could be jettisoned after use. A magnetic dipole antenna also protruded from the top of the upper cone. The shell was composed of laminated plastic. The total mass of the spacecraft after vernier separation was 34.2 kg, after injection rocket firing it would have been 23.2 kg.
        
        The scientific instrument package had a mass of 17.8 kg and consisted of an image scanning infrared television system to study the Moon's surface to a resolution of 1 milliradian, an ionization chamber to measure radiation in space, a diaphragm/microphone assembly to detect micrometeorites, a spin-coil magnetometer to measure magnetic fields to 5 microgauss, and temperature-variable resistors to record spacecraft internal conditions. The spacecraft was powered by nickel-cadmium batteries for ignition of the rockets, silver cell batteries for the television system, and mercury batteries for the remaining circuits. Radio transmission was at on 108.06 MHz through an electric dipole antenna for telemetry and doppler information at 300 mW and a magnetic dipole antenna for the television system at 50 W. Ground commands were received through the electric dipole antenna at 115 MHz. The spacecraft was spin stabilized at 1.8 rps, the spin direction was approximately perpendicular to the geomagnetic meridian planes of the trajectory.
        Mission Profile
        
        The spacecraft did not reach the Moon as planned due to an incorrectly set valve in the upper stage which caused an accelerometer to give faulty information leading to a slight error in burnout velocity (the Thor second stage shut down 10 seconds early) and angle (3.5 degrees). This resulted in a ballistic trajectory with a peak altitude of 113,800 km around 1300 local time. The real-time transmission was obtained for about 75% of the flight, but the percentage of data recorded for each experiment was variable. Except for the first hour of flight, the signal to noise ratio was good. The spacecraft ended transmission when it reentered the Earth's atmosphere after 43 hours of flight on October 13, 1958 at 03:46 UT over the South Pacific Ocean. A small quantity of useful scientific information was returned, showing the radiation surrounding Earth was in the form of bands and measuring the extent of the bands, mapping the total ionizing flux, making the first observations of hydromagnetic oscillations of the magnetic field, and taking the first measurements of the density of micrometeorites and the interplanetary magnetic field.`,
        launchSite: 'Cape Canaveral, United States',
        mass: 34.2
    },
    {
        uuid: '04bebdaa-1579-47a9-ae04-2ed58c3e2e23',
        name: 'Lunar 1958B',
        celestialBody: 'Moon',
        launchDate: '12th October 1958',
        description: `This early Luna launch was the second Soviet attempt to reach the Moon and impact on its surface, with a Ye-1 payload. The SL-3/A-1 launch vehicle (an R-7 rocket (8K72) with a Block Ye upper stage) exploded 104 seconds after launch, again due to vibration. This mission was launched a few hours after the Pioneer 1 mission, an unsuccessful attempt by the U.S. to reach the Moon. Because Luna was on a faster trajectory, it would have reached the Moon first`,
        launchSite: 'Soviet Union - Tyuratam (Baikonur Cosmodrome)',
        mass: null
    },
    {
        uuid: '178292ff-9201-4c49-bc17-4f2c6e7cb004',
        name: 'Pioneer 2',
        celestialBody: 'Mars',
        launchDate: '8th November 1958',
        description: `Pioneer 2 was the last of the three project Able space probes designed to probe lunar and cislunar space. Shortly after launch, the third stage of the launch vehicle separated but failed to ignite, and Pioneer 2 did not achieve its intended lunar orbit. The spacecraft attained a maximum altitude of 1550 km (963 miles) before reentering Earth's atmosphere at 28.7 N, 1.9 E over NW Africa. A small amount of data was obtained during the short flight, including evidence that the equatorial region around Earth has higher flux and higher energy radiation than previously considered and that the micrometeorite density is higher around Earth than in space.
        Spacecraft and Subsystems
        
        Pioneer 2 was nearly identical to Pioneer 1. It consisted of a thin cylindrical midsection with a squat truncated cone frustrum on each side. The cylinder was 74 cm in diameter and the height from the top of one cone to the top of the opposite cone was 76 cm. Along the axis of the spacecraft and protruding from the end of the lower cone was an 11 kg solid propellant injection rocket and rocket case, which formed the main structural member of the spacecraft. Eight small low-thrust solid propellant velocity adjustment rockets were mounted on the end of the upper cone in a ring assembly which could be jettisoned after use. A magnetic dipole antenna also protruded from the top of the upper cone. The shell was composed of laminated plastic. The total mass of the spacecraft after vernier separation but before injection rocket firing was 39.5 kg.
        
        The scientific instrument package had a mass of 15.6 kg and consisted of an STL image-scanning television system (which replaced the image scanning infrared television system on Pioneer 1), a proportional counter for radiation measurements, an ionization chamber to measure radiation in space, a diaphragm/microphone assembly to detect micrometeorites, a spin-coil magnetometer to measure magnetic fields to 5 microgauss, and temperature-variable resistors to record spacecraft internal conditions. The spacecraft was powered by nickel-cadmium batteries for ignition of the rockets, silver cell batteries for the television system, and mercury batteries for the remaining circuits. Radio transmission was at 108.06 MHz through a magnetic dipole antenna for the television system, telemetry, and doppler. Ground commands were received at 115 MHz. The spacecraft was to be spin stabilized at 1.8 rps, the spin direction approximately perpendicular to the geomagnetic meridian planes of the trajectory.`,
        launchSite: 'Cape Canaveral, United States',
        mass: 39.2
    },
    {
        uuid: 'a05df834-ae82-4ff6-b459-39b4dbcb7acd',
        name: 'Lunar 1958C',
        celestialBody: 'Moon',
        launchDate: '4th December 1958',
        description: 'This early Luna launch was the third Soviet attempt to reach the Moon and impact on its surface. It carried a 156 kg Ye-1 payload. A second stage engine of the SL-3/A-1 launcher lost thrust 245 seconds after launch due to failure of a hydrogen peroxide pump gearbox which was compromised by the failure of a hermetic seal and loss of lubricant feed. The rocket lost stability and the engine was shut down by the AVD emergency system.',
        launchSite: 'Soviet Union - Tyuratam (Baikonur Cosmodrome)',
        mass: null
    },
    {
        uuid: '618e4940-5153-4856-92aa-c40593e44d5b',
        name: 'Pioneer 3',
        celestialBody: 'Moon',
        launchDate: '6 December 1958',
        description: `Pioneer 3 was a spin stabilized spacecraft launched by the U.S. Army Ballistic Missile agency in conjunction with NASA. The spacecraft failed to go past the Moon and into a heliocentric orbit as planned, but did reach a maximum altitude of over 102,000 km before falling back to Earth. The revised spacecraft objectives were to measure radiation in the outer Van Allen belt area using Geiger-Mueller tubes and to test the trigger mechanism for a lunar photographic experiment.
        Spacecraft and Subsystems
        
        Pioneer 3 was a cone-shaped probe 58 cm high and 25 cm diameter at its base. The cone was composed of a thin fiberglass shell coated with a gold wash to make it electrically conducting and painted with white stripes to maintain the temperature between 10 and 50 degrees C. At the tip of the cone was a small probe which combined with the cone itself to act as an antenna. At the base of the cone a ring of mercury batteries provided power. A photoelectric sensor protruded from the center of the ring. The sensor was designed with two photocells which would be triggered by the light of the Moon when the probe was within about 30,000 km of the Moon. At the center of the cone was a voltage supply tube and two Geiger-Mueller tubes. A transmitter with a mass of 0.5 kg delivered a phase-modulated signal of 0.1 W at a frequency of 960.05 MHz. The modulated carrier power was 0.08 W and the total effective radiated power 0.18 W. A despin mechanism consisted of two 7 gram weights which could be spooled out to the end of two 150 cm wires when triggered by a hydraulic timer 10 hours after launch. The weights would slow the spacecraft spin from 400 rpm to 6 rpm and then weights and wires would be released.
        Mission Profile
        
        The flight plan called for the Pioneer 3 probe to pass close to the Moon after 33.75 hours and then go into solar orbit. However, depletion of propellant caused the first stage engine to shut down 3.7 seconds early preventing the spacecraft from reaching escape velocity. The injection angle was also about 71 degrees instead of the planned 68 degrees. The spacecraft reached an altitude of 102,360 km (109,740 km from the center of the Earth) before falling back to Earth. It re-entered Earth's atmosphere and burned up over Africa on 7 December at approximately 19:51 UT (2:51 p.m. EST) at an estimated location of 16.4 N, 18.6 E. The probe returned telemetry for about 25 hours of its 38 hour 6 minute journey. The other 13 hours were blackout periods due to the location of the two tracking stations. The returned information showed that the internal temperature remained at about 43 degrees C over most of the period. The data obtained were of particular value since they indicated the existence of two distinct radiation belts.`,
        launchSite: 'Cape Canaveral, United States',
        mass: 5.87
    },
    {
        uuid: '91294df8-4163-4a1a-bd12-e9970f38fd94',
        name: 'Luna 1',
        celestialBody: 'Moon',
        launchDate: '2 January 1959',
        description: `Luna 1 was the first spacecraft to reach the Moon, and the first of a series of Soviet automatic interplanetary stations successfully launched in the direction of the Moon. The spacecraft was sphere-shaped. Five antennae extended from one hemisphere. Instrument ports also protruded from the surface of the sphere. There were no propulsion systems on the Luna 1 spacecraft itself. Because of its high velocity and its announced package of various metallic emblems with the Soviet coat of arms, it was concluded that Luna 1 was intended to impact the Moon.

        The primary objectives of the mission were to measure temperature and pressure inside the vehicle; study the gas components of interplanetary matter and corpuscular radiation of the Sun; measure the magnetic fields of the Earth and moon; study meteoric particles in space; study the distribution of heavy nuclei in primary cosmic radiation; and study other properties of cosmic rays.
        
        On 2 January 1959, after reaching escape velocity, Luna 1 separated from its 1472 kg third stage. The third stage, 5.2 m long and 2.4 m in diameter, travelled along with Luna 1. On 3 January, at a distance of 113,000 km from Earth, a large (1 kg) cloud of sodium gas was released by the spacecraft. This glowing orange trail of gas, visible over the Indian Ocean with the brightness of a sixth-magnitude star, allowed astronomers to track the spacecraft. It also served as an experiment on the behavior of gas in outer space. Luna 1 passed within 5995 km of the Moon's surface on 4 January after 34 hours of flight. It went into orbit around the Sun, between the orbits of Earth and Mars.
        
        The spacecraft contained a 19.993 MHz system which transmitted signals of 50.9 second duration, a 183.6 MHz transmitter for tracking purposes, and a 70.2 MHz transmitter. Four whip antennas and one rigid antenna mounted on the sphere provided the communications link. Power was supplied by mercury-oxide batteries and silver-zinc accumulators. There were five different sets of scientific devices for studying interplanetary space, including a magnetometer, geiger counter, scintillation counter, and micrometeorite detector, and other equipment. The measurements obtained during this mission provided new data on the Earth's radiation belt and outer space, including the discovery that the Moon had no magnetic field and that a solar wind, a strong flow of ionized plasma emmanating from the Sun, streamed through interplanetary space. `,
        launchSite: 'Tyuratam (Baikonur Cosmodrome), U.S.S.R',
        mass: 361
    },
    {
        uuid: '077bbade-2be8-4570-9068-34bfd3f60544',
        name: 'Pioneer 4',
        celestialBody: 'Moon',
        launchDate: '3 March 1959',
        description: `Pioneer 4 was a spin stabilized spacecraft launched on a lunar flyby trajectory and into a heliocentric orbit making it the first US probe to escape from the Earth's gravity. It carried a payload similar to Pioneer 3: a lunar radiation environment experiment using a Geiger-Mueller tube detector and a lunar photography experiment. It passed within 60,000 km of the Moon's surface. However, Pioneer 4 did not come close enough to trigger the photoelectric sensor. No lunar radiation was detected. The spacecraft was still in solar orbit as of 1969.
        Spacecraft and Subsystems
        
        Pioneer 4 was a cone-shaped probe 51 cm high and 23 cm in diameter at its base. The cone was composed of a thin fiberglass shell coated with a gold wash to make it electrically conducting and painted with white stripes to maintain the temperature between 10 and 50 degrees C. At the tip of the cone was a small probe which combined with the cone itself to act as an antenna. At the base of the cone a ring of mercury batteries provided power. A photoelectric sensor protruded from the center of the ring. The sensor was designed with two photocells which would be triggered by the light of the Moon when the probe was within about 30,000 km of the Moon. At the center of the cone was a voltage supply tube and two Geiger-Mueller tubes. A transmitter with a mass of 0.5 kg delivered a phase-modulated signal of 0.1 W at a frequency of 960.05 MHz. The modulated carrier power was 0.08 W and the total effective radiated power 0.18 W. A despin mechanism consisted of two 7 gram weights which spooled out to the end of two 150 cm wires when triggered by a hydraulic timer 10 hours after launch. The weights were designed to slow the spacecraft spin from 400 rpm to 6 rpm and then weights and wires were released.
        Mission Profile
        
        After a successful launch Pioneer 4 achieved its primary objective (an Earth-Moon trajectory), returned radiation data and provided a valuable tracking exercise. The probe passed within 60,000 km of the Moon's surface (7.2 E, 5.7 S) on 4 March 1959 at 22:25 UT (5:25 p.m. EST) at a speed of 7,230 km/hr. The distance was not close enough to trigger the photoelectric sensor. The probe was tracked for 82 hours to a distance of 655,000 km and reached perihelion on 18 March 1959 at 01:00 UT. The cylindrical fourth stage casing (173 cm long, 15 cm diameter, 4.65 kg) went into orbit with the probe.`,
        launchSite: 'Cape Canaveral, United States',
        mass: 6.1
    },
    {
        uuid: 'cbb2e304-466c-4805-a3eb-ce2f095dc3b4',
        name: 'Luna 1959A',
        celestialBody: 'Moon',
        launchDate: '16 June 1959',
        description: 'This Luna launch was an attempt to reach the Moon and impact on its surface. The payload mass was 390 kg, designate Ye-1a. An SL-3/A-1 launcher was used. The guidance system of the R-7 rocket failed during second stage operations 152 seconds after launch and the spacecraft was destroyed by ground command.',
        launchSite: 'Soviet Union - Tyuratam (Baikonur Cosmodrome)',
        mass: null
    },
    {
        uuid: '38abda66-3b8d-4244-91ab-c883de27aa28',
        name: 'Luna 2',
        celestialBody: 'Moon',
        launchDate: '12 September 1959',
        description: `Luna 2 was the second of a series of spacecraft launched in the direction of the Moon. The first spacecraft to land on the Moon, it impacted the lunar surface east of Mare Serenitatis near the Aristides, Archimedes, and Autolycus craters. Luna 2 was similar in design to Luna 1, a spherical spacecraft with protruding antennae and instrument parts. The instrumentation was also similar, including scintillation- and geiger- counters, a magnetometer, and micrometeorite detectors. The spacecraft also carried Soviet pennants. There were no propulsion systems on Luna 2 itself.

        After launch and attainment of escape velocity on 12 September 1959 (13 September Moscow time), Luna 2 separated from its third stage, which travelled along with it towards the Moon. On 13 September the spacecraft released a bright orange cloud of sodium gas which aided in spacecraft tracking and acted as an experiment on the behavior of gas in space. On 14 September at 21:02:23 UT, after 33.5 hours of flight, radio signals from Luna 2 abruptly ceased, indicating it had impacted on the Moon, making it the first spacecraft to contact another solar system body. The impact point, in the Palus Putredinus region, is very roughly estimated to have occurred at 0 degrees longitude, 29.1 degrees N latitude, most estimates give it as within the range 29 to 31 N, 1 W to 1 E. Some 30 minutes after Luna 2, the third stage of its rocket also impacted the Moon at an unknown location. The mission confirmed that the Moon had no appreciable magnetic field, and found no evidence of radiation belts at the Moon. `,
        launchSite: 'Tyuratam (Baikonur Cosmodrome), U.S.S.R',
        mass: 390.2
    },
    {
        uuid: 'a0229b57-6b86-421e-b10b-1096aa2b6ae1',
        name: 'Luna 3',
        celestialBody: 'Moon',
        launchDate: '4 October 1959',
        description: `Luna 3, an automatic interplanetary station, was the third spacecraft successfully launched to the Moon and the first to return images of the lunar far side. The spacecraft returned very indistinct pictures, but, through computer enhancement, a tentative atlas of the lunar farside was produced. These first views of the lunar far side showed mountainous terrain, very different from the near side, and only two dark regions which were named Mare Moscovrae (Sea of Moscow) and Mare Desiderii (Sea of Dreams). (Mare Desiderii was later found to be composed of a smaller mare, Mare Ingenii (Sea of Ingenuity) and other dark craters.)
        Spacecraft and Subsystems
        
        The spacecraft was a cylindrically shaped cannister with hemispherical ends and a wide flange near the top end. The probe was 130 cm long and 120 cm at its maximum diameter at the flange. Most of the cylindrical section was roughly 95 cm in diameter. The cannister was hermetically sealed and pressurized at 0.23 atmospheres. Solar cells were mounted along the outside of the cylinder and provided power to the chemical batteries stored inside the spacecraft. Jalousies for thermal control were also positioned along the cylinder and would open to expose a radiating surface when the interior temperature exceeded 25 degrees C. The upper hemisphere of the probe held the covered opening for the cameras. Four antennae protruded from the top of the probe and two from the bottom. Other scientific apparatus (micrometeoroid and cosmic ray detectors) was mounted on the outside of the probe. Gas jets for attitude control were mounted on the outside of the lower end of the spacecraft. Photoelectric cells were used to maintain orientation with respect to the Sun and Moon. The spacecraft had no rockets for course adjustment. The interior of the spacecraft held the cameras and film processing system, radio equipment, propulsion systems, batteries, gyroscopic units for attitude control, and circulating fans for temperature control. The spacecraft was spin stabilized and was directly radio-controlled from Earth.
        The Yenisey-2 Phototelevision System
        
        The imaging system on Luna 3 was designated Yenisey-2 and consisted of a dual lens camera, an automatic film processing unit, and a scanner. The lenses on the camera were a 200 mm focal length, f/5.6 aperture objective and a 500 mm, f/9.5 objective. The camera carried 40 frames of temperature- and radiation resistant 35-mm isochrome film. The 200 mm objective could image the full disk of the Moon and the 500 mm could take an image of a region on the surface. The camera was fixed in the spacecraft and pointing was achieved by rotating the craft itself. A photocell was used to detect the Moon and orient the upper end of the spacecraft and cameras towards it. Detection of the Moon signaled the camera cover to open and the photography sequence to start automatically. After photography was complete, the film was moved to an on-board processor where it was developed, fixed, and dried. Commands from Earth were then given and the film was moved to a scanner where a bright spot produced by a cathode ray tube was projected through the film onto a photelectric multiplier. The spot was scanned across the film and the photomultiplier converted the intensity of the light passing through the film into an electric signal which was transmitted to Earth. A frame could be scanned with a resolution of 1000 lines, the transmission could be done at a slow rate for large distances from Earth and a faster rate at closer range.
        Mission Profile
        
        After launch on an 8K72 (number I1-8) on a course over the Earth's north pole the Blok-E escape stage was shut down by radio control from Earth at the proper velocity to put the Luna 3 on a trajectory to the Moon. Initial radio contact showed the signal from the probe was only about half as strong as expected and the interior temperature was increasing. The spacecraft spin axis was reoriented and some equipment shut down resulting in a drop in temperature from 40 C to about 30 C. At a distance of 60,000 to 70,000 km from the Moon, the orientation system was turned on and the spacecraft rotation was stopped. The lower end of the station was oriented towards the Sun, which was shining on the far side of the Moon. The spacecraft passed within 6,200 km of the Moon near the south pole at its closest approach at 14:16 UT on 6 October 1959 and continued on to the far side. On 7 October the photocell on the upper end of the spacecraft detected the sunlit far side of the Moon and the photography sequence started. The first image was taken at 03:30 UT at a distance of 63,500 km from the Moon's surface and the last 40 minutes later from 66,700 km. A total of 29 photographs were taken, covering 70% of the far side. After the photography was complete the spacecraft resumed spinning, passed over the north pole of the Moon and returned towards the Earth. Attempts to transmit the photographs to Earth began on 8 October but were believed to be unsuccessful due to the low signal strength. As Luna 3 got closer to Earth a total of 17 resolvable but noisy photographs were transmitted by 18 October. Contact with the probe was lost on 22 October. The probe was believed to have burned up in the Earth's atmosphere in March or April of 1960, but may have survived in orbit until after 1962. `,
        launchSite: 'Tyuratam (Baikonur Cosmodrome), U.S.S.R',
        mass: 278.5
    },
    {
        uuid: '4220ffc0-0962-4c6c-9754-e72d8d0e5759',
        name: 'Pioneer P-3',
        celestialBody: 'Moon',
        launchDate: '26 November 1959',
        description: `Pioneer P-3 (Atlas-Able 4) was intended to be a lunar orbiter probe, but the mission failed shortly after launch. The objectives were to place a highly instrumented probe in lunar orbit, to investigate the environment between the Earth and Moon, and to develop technology for controlling and maneuvering spacecraft from Earth. It was equipped to take images of the lunar surface with a television-like system, estimate the Moon's mass and topography of the poles, record the distribution and velocity of micrometeorites, and study radiation, magnetic fields, and low frequency electromagnetic waves in space. A mid-course propulsion system and injection rocket would have been the first U.S. self-contained propulsion system capable of operation many months after launch at great distances from Earth and the first U.S. tests of maneuvering a satellite in space.
        Mission Profile
        
        The spacecraft was launched on an Air Force-Convair Atlas intercontinental ballistic missile coupled to Thor-Able upper stages including an Able x 248 rocket third stage. The plastic payload shroud broke away 45 seconds after launch, subjecting the payload and third stage rocket to critical aerodynamic loads. At 104 seconds after launch communications with the upper stages was lost and the payload was stripped off followed by the third stage. Telemetry indicated the first and second stages continued as programmed.
        Spacecraft and Subsystems
        
        Pioneer P-3 was a 1 meter diameter sphere with a propulsion system mounted on the bottom giving a total length of 1.4 meters. The mass of the structure and aluminum alloy shell was 25.3 kg and the propulsion units 88.4 kg. Four solar panels, each 60 x 60 cm and containing 2200 solar cells in 22 100-cell nodules, extended from the sides of the spherical shell in a "paddle-wheel" configuration with a total span of about 2.7 meters. The solar panels charged chemical batteries. Inside the shell, a large spherical hydrazine tank made up most of the volume, topped by two smaller spherical nitrogen tanks and a 90 N injection rocket to slow the spacecraft down to go into lunar orbit, which was designed to be capable of firing twice during the mission. Attached to the bottom of the sphere was a 90 N vernier rocket for mid-course propulsion and lunar orbit maneuvers which could be fired four times.
        
        Around the upper hemisphere of the hydrazine tank was a ring-shaped instrument platform which held the batteries in two packs, two 5 W UHF transmitters and diplexers, logic modules for scientific instruments, two command receivers, decoders, a buffer/amplifier, three converters, a telebit, a command box, and most of the scientific instruments. Two dipole UHF antennas protruded from the top of the sphere on either side of the injection rocket nozzle. Two dipole UHF antennas and a long VLF antenna protruded from the bottom of the sphere.
        
        Thermal control was planned to be achieved by a large number of small "propeller blade" devices on the surface of the sphere. The blades themselves were made of reflective material and consist of four vanes which were flush against the surface, covering a black heat-absorbing pattern painted on the sphere. A thermally sensitive coil was attached to the blades in such a way that low temperatures within the satellite would cause the coil to contract and rotate the blades and expose the heat absorbing surface, and high temperatures would cause the blades to cover the black patterns. Square heat-sink units were also mounted on the surface of the sphere to help dissipate heat from the interior.
        Scientific Instrumentation
        
        The scientific instruments consisted of an ion chamber and Geiger-Mueller tube to measure total radiation flux, a proportional radiation counter telescope to measure high energy radiation, a scintillation counter to monitor low-energy radiation, a VLF receiver for natural radio waves, a transponder to study electron density, and part of the television facsimile system and flux-gate and search coil magnetometers mounted on the instrument platform. The television camera pointed through a small hole in the sphere between two of the solar panel mounts. The micrometeorite detector was mounted on the sphere as well. The total mass of the science package including electronics and power supply was 55 kg.`,
        launchSite: 'Cape Canaveral, United States',
        mass: 168.7
    },
    {
        uuid: 'e4408d31-5534-43d4-b555-a9aff942d646',
        name: 'Luna 1960A',
        celestialBody: 'Moon',
        launchDate: '15 April 1960 ',
        description: 'This Luna mission was an attempt to duplicate the Luna 3 achievement of photographing the far side of the Moon, but passing closer to the lunar surface with higher resolution cameras (The Yenisey photo-television unit). The probe was designated Ye-2f and had a mass of approximately 280 kg. A premature cutoff (3 seconds early) of the upper stage RD-105 engine of the SL-3/A-1 launcher resulted in a velocity 130 m/s less than what was needed. The spacecraft reached an altitude of only 200,000 km and fell back. The cause of the early cutoff was found to be due to the upper stage not being fully fueled with kerosene. ',
        launchSite: 'Soviet Union - Tyuratam (Baikonur Cosmodrome)',
        mass: null
    },
    {
        uuid: '1a6af8d0-a582-43a9-8362-8a1b5e6bf69c',
        name: 'Luna 1960B',
        celestialBody: 'Moon',
        launchDate: '18 April 1960',
        description: 'This Luna mission was an attempt to duplicate the Luna 3 achievement of photographing the far side of the Moon, but passing closer to the lunar surface with higher resolution cameras (The Yenisey photo-television unit). The probe was designated Ye-2f and had a mass of approximately 280 kg. At launch, the four strap-on blocks of the SL-3/A-1 launcher failed to ignite correctly and broke loose, firing off in random directions. The accident caused considerable damage to the launch pad. Some sources give the launch date as April 16.',
        launchSite: 'Soviet Union - Tyuratam (Baikonur Cosmodrome)',
        mass: null
    },
    {
        uuid: '8eec31fe-cd70-47a3-bf94-6171b1299d2b',
        name: 'Pioneer P-30',
        celestialBody: '',
        launchDate: '25 Sept 1960',
        description: `Pioneer P-30 (Atlas-Able 5A) was intended to be a lunar orbiter probe, but the mission failed shortly after launch. The objectives were to place a highly instrumented probe in lunar orbit, to investigate the environment between the Earth and Moon, and to develop technology for controlling and maneuvering spacecraft from Earth. It was equipped to estimate the Moon's mass and topography of the poles, record the distribution and velocity of micrometeorites, and study radiation, magnetic fields, and low frequency electromagnetic waves in space. A mid-course propulsion system and injection rocket would have been the first U.S. self-contained propulsion system capable of operation many months after launch at great distances from Earth and the first U.S. tests of maneuvering a satellite in space.
        Mission Profile
        
        The spacecraft was launched on an Air Force-Convair Atlas D intercontinental ballistic missile coupled to Thor-Able upper stages including a Hercules ABL solid propellant third stage. The first stage burned normally for 275 seconds, the two Atlas booster engines were jettisonned as planned after ~250 seconds. At an altitude of about 370 km the first stage separated from the second stage. When the second stage was ignited telemetry showed abnormal burning and the stage failed due to a malfunction in the oxidizer system. The vehicle was unable to achieve Earth orbit, re-entered and was believed to have come down somewhere in the Indian Ocean. Signals were returned by the payload for 1020 seconds after launch. The mission was designed to reach the Moon approximately 62 hours after launch.
        Spacecraft and Subsystems
        
        Pioneer P-30 was almost identical to the earlier Pioneer P-3 satellite which failed (PIONX), a 1 meter diameter sphere with a propulsion system mounted on the bottom giving a total length of 1.4 meters. The mass of the structure and aluminum alloy shell was about 30 kg and the propulsion units roughly 90 kg. Four solar panels, each 60 x 60 cm and containing 2200 solar cells in 22 100-cell nodules, extended from the sides of the spherical shell in a "paddle-wheel" configuration with a total span of about 2.7 meters. The solar panels charged nickel-cadmium batteries. Inside the shell, a large spherical hydrazine tank made up most of the volume, topped by two smaller spherical nitrogen tanks and a 90 N injection rocket to slow the spacecraft down to go into lunar orbit, which was designed to be capable of firing twice during the mission. Attached to the bottom of the sphere was a 90 N vernier rocket for mid-course propulsion and lunar orbit maneuvers which could be fired four times.
        
        Around the upper hemisphere of the hydrazine tank was a ring-shaped instrument platform which held the batteries in two packs, two 1.5 W UHF transmitters and diplexers, logic modules for scientific instruments, two command receivers, decoders, a buffer/amplifier, three converters, a telebit, a command box, and most of the scientific instruments. Two dipole UHF antennas protruded from the top of the sphere on either side of the injection rocket nozzle. Two dipole UHF antennas and a long VLF antenna protruded from the bottom of the sphere. The transmitters operated on a frequency of 378 megacycles.
        
        Thermal control was planned to be achieved by fifty small "propeller blade" devices on the surface of the sphere. The blades themselves were made of reflective material and consist of four vanes which were flush against the surface, covering a black heat-absorbing pattern painted on the sphere. A thermally sensitive coil was attached to the blades in such a way that low temperatures within the satellite would cause the coil to contract and rotate the blades and expose the heat absorbing surface, and high temperatures would cause the blades to cover the black patterns. Square heat-sink units were also mounted on the surface of the sphere to help dissipate heat from the interior.
        Scientific Instrumentation
        
        The scientific instruments consisted of an ion chamber and Geiger-Mueller tube to measure total radiation flux, a proportional radiation counter telescope to measure high energy radiation, a scintillation counter to monitor low-energy radiation, a VLF receiver for natural radio waves, a transponder to study electron density, and part of the flux-gate and search coil magnetometers mounted on the instrument platform. The micrometeorite detector and sun scanner were mounted on the sphere. The difference between the payload of Pioneer P-30 and the earlier Pioneer P-3 was the replacement of the TV facsimile system on P-3 with a scintillation spectrometer to study the Earth's (and possible lunar) radiation belts, mounted on the instrument platform, and a plasma probe mounted on the sphere to measure energy and momentum distribution of protons above a few kilovolts to study the radiation effect of solar flares. The total mass of the science package including electronics and power supply was roughly 60 kg. Total cost of the mission was estimated at 9 - 10 million dollars.`,
        launchSite: 'Cape Canaveral, United States',
        mass: 175.5
    },
    {
        uuid: '0d0816c6-6867-4b68-bad0-2b1f333380ce',
        name: 'Marsnik 1',
        celestialBody: 'Mars',
        launchDate: ' 10 October 1960',
        description: `Marsnik 1 (also known as Korabl 4 and Mars 1960A) was reported by the NASA Administrator to Congress in 1962 to be an attempt at a Mars probe. Some Soviet scientists involved with the program at that time claim no knowledge of this mission, stating that only the launch on October 14 (Marsnik 2) was an intended Mars mission. However V.G. Perminov, the leading designer of planetary spacecraft at the Lavochkin design bureau, states that this mission was indeed intended for Mars, was identical to Marsnik 2, and was launched unsuccessfully in October 1960.
        Mission Profile
        
        This would have been the Soviet Union's first attempt at a planetary probe. The objectives of the mission were to investigate interplanetary space between Earth and Mars, to study Mars and return surface images from a flyby trajectory, and to study the effects of extended spaceflight on onboard instruments and provide radio communications from long distances. After launch, the third stage pumps were unable to develop enough thrust to commence ignition, so Earth parking orbit was not achieved. The spacecraft reached an altitude of 120 km before reentry.
        Spacecraft and Subsystems
        
        The spacecraft was nearly identical to the Venera 1 design, a cylindrical body about 2 meters high with two solar panel wings, a 2.33 meter high-gain net antenna, and a long antenna arm, and had a mass of about 650 kg. It carried a 10 kg science payload consisting of a magnetometer on a boom, cosmic ray counter, plasma-ion trap, a radiometer, a micrometeorite detector, and a spectroreflectometer to study the CH band, a possible indicator of life on Mars. These instruments were mounted on the outside of the spacecraft. A photo-television camera was held in a sealed module in the spacecraft and could take pictures through a viewport when a sensor indicated the Sun-illuminated martian surface was in view.
        
        Attitude was controlled by a Sun-star sensor with attitude correction performed by a dimethylhydrazine/nitric acid binary propellant engine. The spacecraft orientation was to be maintained so that the solar panels faced the Sun throughout the flight. Power was provided by the two-square meter solar panels which charged silver-zinc batteries. Radio communications were made using a decimeter band transmitter via the high gain antenna for spacecraft commands and telemetry. Radio bearing was used to maintain the antennas orientation to Earth. Images were to be transferred using an 8-cm wavelength transmitter through the high-gain antenna. A fourth stage was added to the booster, the Molniya or 8K78, the new launcher was designated SL-6/A-2-e. `,
        launchSite: 'Tyuratam (Baikonur Cosmodrome), U.S.S.R',
        mass: 650
    },
    {
        uuid: '1cf39956-9894-4685-a9b5-2386180bc3cc',
        name: 'Marsnik 2',
        celestialBody: 'Mars',
        launchDate: ' 14 October 1960',
        description: `Marsnik 2, an intended Mars flyby mission, was either the Soviet Union's first or second attempt at a planetary probe, depending on whether the probe designated as Marsnik 1 reputedly launched four days earlier was actually designed to go to Mars. The objectives of the mission were to investigate interplanetary space between Earth and Mars, to study Mars and return surface images from a flyby trajectory, and to study the effects of extended spaceflight on onboard instruments and provide radio communications from long distances. After launch, the third stage pumps were unable to develop enough thrust to commence ignition, so Earth parking orbit was not achieved. The spacecraft reached an altitude of 120 km before reentry.
        Spacecraft and Subsystems
        
        The spacecraft was nearly identical to the Venera 1 design, a cylindrical body about 2 meters high with two solar panel wings, a 2.33 meter high-gain net antenna, and a long antenna arm, and had a mass of about 650 kg. It carried a 10 kg science payload consisting of a magnetometer on a boom, cosmic ray counter, plasma-ion trap, a radiometer, a micrometeorite detector, and a spectroreflectometer to study the CH band, a possible indicator of life on Mars. These instruments were mounted on the outside of the spacecraft. A photo-television camera was held in a sealed module in the spacecraft and could take pictures through a viewport when a sensor indicated the Sun-illuminated martian surface was in view.
        
        Attitude was controlled by a Sun-star sensor with attitude correction performed by a dimethylhydrazine/nitric acid binary propellant engine. The spacecraft orientation was to be maintained so that the solar panels faced the Sun throughout the flight. Power was provided by the two-square meter solar panels which charged silver-zinc batteries. Radio communications were made using a decimeter band transmitter via the high gain antenna for spacecraft commands and telemetry. Radio bearing was used to maintain the antennas orientation to Earth. Images were to be transferred using an 8-cm wavelength transmitter through the high-gain antenna. A fourth stage was added to the booster, the Molniya or 8K78, the new launcher was designated SL-6/A-2-e.`,
        launchSite: 'Tyuratam (Baikonur Cosmodrome), U.S.S.R',
        mass: 640
    },
    {
        uuid: '23b1d0bb-8edd-4163-9988-9b253b048cb7',
        name: 'Pioneer P-31',
        celestialBody: 'Moon',
        launchDate: '15 December 1960',
        description: `Pioneer P-31 (Atlas-Able 5B) was intended to be a lunar orbiter probe, but the mission failed shortly after launch. The objectives were to place a highly instrumented probe in lunar orbit, to investigate the environment between the Earth and Moon, and to develop technology for controlling and maneuvering spacecraft from Earth. It was equipped to take images of the lunar surface with a television-like system, estimate the Moon's mass and topography of the poles, record the distribution and velocity of micrometeorites, and study radiation, magnetic fields, and low frequency electromagnetic waves in space. A mid-course propulsion system and injection rocket would have been the first U.S. self-contained propulsion system capable of operation many months after launch at great distances from Earth and the first U.S. tests of maneuvering a satellite in space.
        Mission Profile
        
        The spacecraft was launched on an Air Force-Convair Atlas D intercontinental ballistic missile coupled to Thor-Able upper stages including an Able solid propellant third stage. The vehicle exploded 68 seconds after launch at an altitude of 12 km due to a malfunction in the first stage. The payload fell into the Atlantic Ocean 12 to 20 km from Cape Canaveral in about 20 meter deep water.
        Spacecraft and Subsystems
        
        Pioneer P-31 was virtually identical to the earlier Pioneer P-30 satellite which failed (PIONY), a 1 meter diameter sphere with a propulsion system mounted on the bottom giving a total length of 1.4 meters. The mass of the structure and aluminum alloy shell was about 30 kg and the propulsion units roughly 90 kg. Four solar panels, each 60 x 60 cm and containing 2200 solar cells in 22 100-cell nodules, extended from the sides of the spherical shell in a "paddle-wheel" configuration with a total span of about 2.7 meters. The solar panels charged nickel-cadmium batteries. Inside the shell, a large spherical hydrazine tank made up most of the volume, topped by two smaller spherical nitrogen tanks and a 90 N injection rocket to slow the spacecraft down to go into lunar orbit, which was designed to be capable of firing twice during the mission. Attached to the bottom of the sphere was a 90 N vernier rocket for mid-course propulsion and lunar orbit maneuvers which could be fired four times.
        
        Around the upper hemisphere of the hydrazine tank was a ring-shaped instrument platform which held the batteries in two packs, two 1.5 W UHF transmitters and diplexers, logic modules for scientific instruments, two command receivers, decoders, a buffer/amplifier, three converters, a telebit, a command box, and most of the scientific instruments. Two dipole UHF antennas protruded from the top of the sphere on either side of the injection rocket nozzle. Two dipole UHF antennas and a long VLF antenna protruded from the bottom of the sphere. The transmitters operated on a frequency of 378 megacycles.
        
        Thermal control was planned to be achieved by fifty small "propeller blade" devices on the surface of the sphere. The blades themselves were made of reflective material and consist of four vanes which were flush against the surface, covering a black heat-absorbing pattern painted on the sphere. A thermally sensitive coil was attached to the blades in such a way that low temperatures within the satellite would cause the coil to contract and rotate the blades and expose the heat absorbing surface, and high temperatures would cause the blades to cover the black patterns. Square heat-sink units were also mounted on the surface of the sphere to help dissipate heat from the interior.
        Scientific Instrumentation
        
        The scientific instruments consisted of an ion chamber and Geiger-Mueller tube to measure total radiation flux, a proportional radiation counter telescope to measure high energy radiation, a scintillation counter to monitor low-energy radiation, a scintillation spectrometer to study the Earth's (and possible lunar) radiation belts, a VLF receiver for natural radio waves, a transponder to study electron density, and part of the flux-gate and search coil magnetometers mounted on the instrument platform. A plasma probe was mounted on the sphere to measure energy and momentum distribution of protons above a few kilovolts to study the radiation effect of solar flares. The micrometeorite detector and sun scanner were mounted on the sphere as well. The only difference between Pioneer P-31 and the earlier Pioneer P-30 was the addition of a solid state detector sensitive to low energy protons on the satellite and an STL-designed rubidium frequency standard experiment placed on a pod attached to the booster. The total mass of the science package including electronics and power supply was roughly 60 kg. Total cost of the mission was estimated at 9 - 10 million dollars.`,
        launchSite: 'Cape Canaveral, United States',
        mass: 175
    },
    {
        uuid: '8d512798-5985-4f55-8f08-3345310c5558',
        name: 'Sputnik 7',
        celestialBody: 'Venus',
        launchDate: ' 4 February 1961',
        description: `This was the first Soviet attempt at a Venus probe. The probe was successfully launched into Earth orbit with a SL-6/A-2-e (Molniya 8K78) launcher. The launch payload consisted of an Earth orbiting launch platform (Tyazheliy Sputnik 4) and the Venera probe. The fourth stage (a Blok L Zond rocket) was supposed to launch the Venera probe towards a landing on Venus after one Earth orbit but ignition failed, probably due to a fault in the power supply to the guidance system, the PT-200 DC transformer had not been designed to work in a vacuum. The spacecraft and launch platform remained attached in a 212 x 318 km, 64.95 degree inclination, 89.8 minute Earth orbit. Because of its large size (6483 kg), the mission was originally thought by non-Soviet observers to be a failed manned mission, and later was described as a test of an Earth orbiting platform from which an interplanetary probe could be launched. This was the first attempt to launch a spacecraft from a preliminary Earth orbit. The orbit decayed and the spacecraft reentered the Earth's atmosphere on 26 February after 22 days.

        The Venera probe had a mass of about 645 kg and was based on the M1 (Mars) spacecraft design. It was designed as a Venus atmospheric probe. It carried a 3-axis magnetometer, a variometer (vertical speed indicator), and charged particle monitors. It also carried a small globe which held medallions and other commemorations of the mission. The spacecraft communications were at 66 and 66.2 MHz.`,
        launchSite: 'Tyuratam (Baikonur Cosmodrome), U.S.S.R',
        mass: 6843
    },
    {
        uuid: '6f45c937-4149-45d8-bf75-46e80ea15da3',
        name: 'Venera 1',
        celestialBody: 'Venus',
        launchDate: ' 12 February 1961',
        description: `Venera 1 (Automatic Interplanetary Station) was the first spacecraft to fly by Venus. The probe consisted of a cylindrical body topped by a dome, totaling 2.035 meters in height, 1.050 meters in diameter, with a fueled mass of 643.5 kg. Two solar panels, with a total area of 2 square meters, extended radially from the cylinder. A large (over 2 meter diameter) high-gain net antenna was planned to transmit signals from Venus at 8 cm and 32 cm wavelengths. This antenna was attached to the cylinder. A 2.4 meter long omni-directional antenna arm was designed for 1.6 m wavelength transmissions, and a T-shaped antenna was used to transmit signals to Earth at 922.8 MHz at 1 bit/sec. Uplink commands were sent to the spacecraft at 770 MHz at 1.6 bit/sec. The probe was equipped with scientific instruments including a magnetometer attached to the end of a 2 meter boom, ion traps, micrometeorite detectors, and cosmic radiation counters. The dome contained a sphere pressurized at 1.2 atm., which carried a Soviet pennant and was designed to float on the putative Venus oceans after the intended Venus impact. Venera 1 had an on-board mid-course correction engine (although this was not labelled in diagrams of the spacecraft). Temperature control, nominally 30 C, was achieved with thermal shutters. Attitude control was achieved through the use of Sun and star sensors, gyroscopes, and nitrogen gas jets.

        Venera 1 was launched on 12 February 1961 along with an Earth orbiting launch platform (Tyazheliy Sputnik 5, also called Sputnik 8 (1961-003C)) with a SL-6/A-2-e launcher. From a 229 x 282 km, 65.7 degree inclination orbit, the Venera 1 automatic interplanetary station was launched from the platform towards Venus with the fourth stage Zond rocket. Two communications sessions were achieved in the days right after launch, one on 12 February at a distance of 126,300 km, and one on 13 February at 488,900 km. The station was scheduled to transmit nominally every 5 days. On 17 February, a communication session took place from 1.89 million km, showing normal operations with temperature of 29 C and pressure of 900 mm inside the dome. The scientific instruments also returned data. On 22 February a command session was held at 3.2 million km, according to the OKB-1 Design Bureau the commands were acknowledged, but this has also been reported as a failure and the last successful communications may have been on 17 February. On 27 February "fadeouts" were reported, there is no record of successful communication. On 4 March, at a distance of 7.5 million km, communications failed, and no further contact was made with Venera 1. The mid-course correction motors could not be fired, and on May 19 and 20, 1961, Venera 1 passed within 100,000 km of Venus and entered a heliocentric orbit. `,
        launchSite: 'Tyuratam (Baikonur Cosmodrome), U.S.S.R',
        mass: 643.5
    },
    {
        uuid: '68a1dac9-44ca-4bd0-8ed0-bb604ead56a0',
        name: 'Ranger 1',
        celestialBody: 'Moon',
        launchDate: '23 August 1961 ',
        description: `Ranger 1 was a spacecraft whose primary mission was to test the performance of those functions and parts necessary for carrying out subsequent lunar and planetary missions using essentially the same spacecraft design. A secondary objective was to study the nature of particles and fields in interplanetary space. Failure of the Agena B to re-ignite left Ranger 1 stranded in low-Earth orbit.
        Spacecraft and Subsystems
        
        The spacecraft was of the Ranger Block 1 design and consisted of a hexagonal base 1.5 m across upon which was mounted a cone-shaped 4 m high tower of aluminum struts and braces. Two solar panel wings measuring 5.2 m from tip to tip extended from the base. A high-gain directional dish antenna was attached to the bottom of the base. Spacecraft experiments and other equipment were mounted on the base and tower. Instruments aboard the spacecraft included a Lyman-alpha telescope, a rubidium-vapor magnetometer, electrostatic analyzers, medium-energy range particle detectors, two triple coincidence telescopes, a cosmic-ray integrating ionization chamber, cosmic dust detectors, and solar X-ray scintillation counters.
        
        The communications system included the high gain antenna and an omni-directional medium gain antenna and two transmitters, one at 960.1-mhz with 0.25 W power output and the other at 960.05-mhz with 3 W power output. Power was to be furnished by 8680 solar cells on the two panels, a 57 kg silver-zinc battery, and smaller batteries on some of the experiments. Attitude control was provided by a solid-state timing controller, Sun and Earth sensors, and pitch and roll jets. The temperature was controlled passively by gold plating, white paint, and polished aluminum surfaces.
        Mission Profile
        
        The Ranger 1 spacecraft was designed to go into an Earth parking orbit and then into a roughly 60,000 x 1,100,000 km Earth orbit to test systems and strategies for future lunar missions. Ranger 1 launched on 23 August 1961 at 10:04:10.26 UT into the Earth parking orbit as planned, but the Agena B restart sequence shut down when a switch malfunctioned and stopped the flow of red fuming nitric acid to the rocket engine. It did not go into the planned higher trajectory, so when Ranger 1 separated from the Agena stage it went into a low Earth orbit (179 x 446 km) and began tumbling a day later when its attitude control gas supply was exhausted. On August 27 the main battery died. On the 111th orbit the satellite re-entered Earth's atmosphere over the Gulf of Mexico at about 09:00 UT on 30 August 1961. Ranger 1 was partially successful, much of the primary objective of flight testing the equipment was accomplished but little scientific data was returned.
        
        Total research, development, launch, and support costs for the Ranger series of spacecraft (Rangers 1 through 9) was approximately $170 million.`,
        launchSite: 'Cape Canaveral, United States',
        mass: 306.2
    },
    {
        uuid: '70544077-cd17-45b3-844c-73fec1f5adef',
        name: 'Ranger 2',
        celestialBody: 'Moon',
        launchDate: ' 18 November 1961',
        description: `This was a flight test of the Ranger spacecraft system designed for future lunar and interplanetary missions. Ranger 2 was designed to go into a deep space trajectory to test various systems for future exploration and to conduct scientific observations of cosmic rays, magnetic fields, radiation, dust particles, and a possible hydrogen gas "tail" trailing the Earth. A gyro failure resulted in the spacecraft being stranded in a low Earth orbit with a lifetime of less than a day.
        Spacecraft and Subsystems
        
        Ranger 2 was of the Ranger Block 1 design and was almost identical to Ranger 1. The spacecraft consisted of a hexagonal base 1.5 m across upon which was mounted a cone-shaped 4 m high tower of aluminum struts and braces. Two solar panel wings measuring 5.2 m from tip to tip extended from the base. A high-gain directional dish antenna was attached to the bottom of the base. Spacecraft experiments and other equipment were mounted on the base and tower. Instruments aboard the spacecraft included a Lyman-alpha telescope, a rubidium-vapor magnetometer, electrostatic analyzers, medium-energy-range particle detectors, two triple coincidence telescopes, a cosmic-ray integrating ionization chamber, cosmic dust detectors, and scintillation counters.
        
        The communications system included the high gain antenna and an omni-directional medium gain antenna and two transmitters at approximately 960-mhz, one with 0.25 W power output and the other with 3 W power output. Power was to be furnished by 8680 solar cells on the two panels, a 53.5 kg silver-zinc battery, and smaller batteries on some of the experiments. Attitude control was provided by a solid-state timing controller, Sun and Earth sensors, gyroscopes, and pitch and roll jets. The temperature was controlled passively by gold plating, white paint, and polished aluminum surfaces.
        Mission Profile
        
        The spacecraft was launched on 18 November 1961 at 08:12:21.5 UT into a low Earth parking orbit, but an inoperative roll gyro prevented Agena restart. The spacecraft could not be put into its planned deep-space trajectory, resulting in Ranger 2 being stranded in low Earth orbit upon separation from the Agena stage. The last day=ta were received by a small mobile tracking antenna in Johannesburg, South Africa on 18 November at 14:56 UT. The orbit decayed and the spacecraft reentered Earth's atmosphere on at about 04:00 UT on 19 November 1961.
        
        Total research, development, launch, and support costs for the Ranger series of spacecraft (Rangers 1 through 9) was approximately $170 million.`,
        launchSite: 'Cape Canaveral, United States',
        mass: 304
    },
    {
        uuid: '5e4ea216-00a9-4ba8-bb3f-adabcf622764',
        name: 'Ranger 3',
        celestialBody: 'Moon',
        launchDate: '26 January 1962',
        description: `Ranger 3 was designed to transmit pictures of the lunar surface to Earth stations during a period of 10 minutes of flight prior to impacting on the Moon, to rough-land a seismometer capsule on the Moon, to collect gamma-ray data in flight, to study radar reflectivity of the lunar surface, and to continue testing of the Ranger program for development of lunar and interplanetary spacecraft. Due to a series of malfunctions the spacecraft missed the Moon.
        Spacecraft and Subsystems
        
        Ranger 3 was the first of the so-called Block II Ranger designs. The basic vehicle was 3.1 m high and consisted of a lunar capsule covered with a balsawood impact-limiter, 65 cm in diameter, a mono-propellant mid-course motor, a 5080-pound thrust retrorocket, and a gold- and chrome-plated hexagonal base 1.5 m in diameter. A large high-gain dish antenna was attached to the base. Two wing-like solar panels (5.2 m across) were attached to the base and deployed early in the flight. Power was generated by 8680 solar cells contained in the solar panels which charged a 11.5 kg 1000 W-hour capacity AgZn launching and backup battery. Spacecraft control was provided by a solid-state computer and sequencer and an earth-controlled command system. Attitude control was provided by Sun and Earth sensors, gyroscopes, and pitch and roll jets. The telemetry system aboard the spacecraft consisted of two 960 MHz transmitters, one at 3 W power output and the other at 50 mW power output, the high-gain antenna, and an omni-directional antenna. White paint, gold and chrome plating, and a silvered plastic sheet encasing the retrorocket furnished thermal control.
        
        The experimental apparatus included: (1) a vidicon television camera, which employed a scan mechanism that yielded one complete frame in 10 s; (2) a gamma-ray spectrometer mounted on a 1.8 m boom; (3) a radar altimeter; and (4) a seismometer to be rough-landed on the lunar surface. The seismometer was encased in the lunar capsule along with an amplifier, a 50-milliwatt transmitter, voltage control, a turnstile antenna, and 6 silver-cadmium batteries capable of operating the lunar capsule transmitter for 30 days, all designed to land on the Moon at 130 to 160 km/hr (80 -100 mph). The radar altimeter would be used for reflectivity studies, but was also designed to initiate capsule separation and ignite the retro-rocket.
        Mission Profile
        
        The mission was designed to boosted towards the Moon by an Atlas/Agena, undergo one mid-course correction, and impact the lunar surface. At the appropriate altitude the capsule was to separate and the retrorockets ignite to cushion the landing. A malfunction in the booster guidance system resulted in excessive spacecraft speed. Reversed command signals caused the spacecraft to pitch in the wrong direction and the TM antenna to lose earth acquisition, and mid-course correction was not possible. Finally a spurious signal during the terminal maneuver prevented transmission of useful TV pictures. Ranger 3 missed the Moon by approximately 36,800 km on 28 January and is now in a heliocentric orbit. Some useful engineering data were obtained from the flight.
        
        Total research, development, launch, and support costs for the Ranger series of spacecraft (Rangers 1 through 9) was approximately $170 million.`,
        launchSite: 'Cape Canaveral, United States',
        mass: 329.8
    },
    {
        uuid: '76c8ba3c-dd1f-46fa-b49c-2ef58289fbce',
        name: 'Ranger 4',
        celestialBody: 'Moon',
        launchDate: '23 April 1962',
        description: `Ranger 4 was designed to transmit pictures of the lunar surface to Earth stations during a period of 10 minutes of flight prior to impacting on the Moon, to rough-land a seismometer capsule on the Moon, to collect gamma-ray data in flight, to study radar reflectivity of the lunar surface, and to continue testing of the Ranger program for development of lunar and interplanetary spacecraft. An onboard computer failure caused failure of the deployment of the solar panels and navigation systems, the spacecraft impacted on the far side of the Moon without returning any scientific data.
        Spacecraft and Subsystems
        
        Ranger 4 was a Block II Ranger spacecraft virtually identical to Ranger 3. The basic vehicle was 3.1 m high and consisted of a lunar capsule covered with a balsawood impact-limiter, 65 cm in diameter, a mono-propellant mid-course motor, a 5080-pound thrust retrorocket, and a gold- and chrome-plated hexagonal base 1.5 m in diameter. A large high-gain dish antenna was attached to the base. Two wing-like solar panels (5.2 m across) were attached to the base and deployed early in the flight. Power was generated by 8680 solar cells contained in the solar panels which charged a 11.5 kg 1000 W-hour capacity AgZn launching and backup battery. Spacecraft control was provided by a solid-state computer and sequencer and an earth-controlled command system. Attitude control was provided by Sun and Earth sensors, gyroscopes, and pitch and roll jets. The telemetry system aboard the spacecraft consisted of two 960 MHz transmitters, one at 3 W power output and the other at 50 mW power output, the high-gain antenna, and an omni-directional antenna. White paint, gold and chrome plating, and a silvered plastic sheet encasing the retrorocket furnished thermal control.
        
        The experimental apparatus included: (1) a vidicon television camera, which employed a scan mechanism that yielded one complete frame in 10 s; (2) a gamma-ray spectrometer mounted on a 1.8 m boom; (3) a radar altimeter; and (4) a seismometer to be rough-landed on the lunar surface. The seismometer was encased in the lunar capsule along with an amplifier, a 50-milliwatt transmitter, voltage control, a turnstile antenna, and 6 silver-cadmium batteries capable of operating the lunar capsule transmitter for 30 days, all designed to land on the Moon at 130 to 160 km/hr (80 -100 mph). The radar altimeter would be used for reflectivity studies, but was also designed to initiate capsule separation and ignite the retro-rocket.
        Mission Profile
        
        The mission was designed to boosted towards the Moon by an Atlas/Agena, undergo one mid-course correction, and impact the lunar surface. At the appropriate altitude the capsule was to separate and the retrorockets ignite to cushion the landing. Due to an apparent failure of a timer in the spacecraft's central computer and sequencer following launch the command signals for the extension of the solar panels and the operation of the sun and earth acquisition system were never given. The instrumentation ceased operation after about 10 hours of flight. The spacecraft was tracked by the battery-powered 50 milliwatt transmitter in the lunar landing capsule. Ranger 4 impacted the far side of the Moon (229.3 degrees E, 15.5 degrees S) at 9600 km/hr at 12:49:53 UT on April 26, 1962 after 64 hours of flight.
        
        Total research, development, launch, and support costs for the Ranger series of spacecraft (Rangers 1 through 9) was approximately $170 million.`,
        launchSite: 'Cape Canaveral, United States',
        mass: 331.1
    },
    {
        uuid: '92dc457c-3677-4140-887f-e2700425ce23',
        name: 'Marina 1',
        celestialBody: 'Venus',
        launchDate: ' 22 July 1962',
        description: `This was to be the first Mariner mission. It was intended to perform a Venus flyby. The vehicle was destroyed by the Range Safety Officer 293 seconds after launch at 09:26:16 UT when it veered off course. The booster had performed satisfactorily until an unscheduled yaw-lift (northeast) maneuver was detected by the range safety officer. Faulty application of the guidance commands made steering impossible and were directing the spacecraft towards a crash, possibly in the North Atlantic shipping lanes or in an inhabited area. The destruct command was sent 6 seconds before separation, after which the launch vehicle could not have been destroyed. The radio transponder continued to transmit signals for 64 seconds after the destruct command had been sent.

        The failure was apparently caused by a combination of two factors. Improper operation of the Atlas airborne beacon equipment resulted in a loss of the rate signal from the vehicle for a prolonged period. The airborne beacon used for obtaining rate data was inoperative for four periods ranging from 1.5 to 61 seconds in duration. Additionally, the Mariner 1 Post Flight Review Board determined that the omission of a hyphen in coded computer instructions in the data-editing program allowed transmission of incorrect guidance signals to the spacecraft. During the periods the airborne beacon was inoperative the omission of the hyphen in the data-editing program caused the computer to incorrectly accept the sweep frequency of the ground receiver as it sought the vehicle beacon signal and combined this data with the tracking data sent to the remaining guidance computation. This caused the computer to swing automatically into a series of unnecessary course corrections with erroneous steering commands which finally threw the spacecraft off course.
        Spacecraft and Subsystems
        
        The Mariner 1 spacecraft was identical to Mariner 2, launched 27 August 1962. Mariner 1 consisted of a hexagonal base, 1.04 meters across and 0.36 meters thick, which contained six magnesium chassis housing the electronics for the science experiments, communications, data encoding, computing, timing, and attitude control, and the power control, battery, and battery charger, as well as the attitude control gas bottles and the rocket engine. On top of the base was a tall pyramid-shaped mast on which the science experiments were mounted which brought the total height of the spacecraft to 3.66 meters. Attached to either side of the base were rectangular solar panel wings with a total span of 5.05 meters and width of 0.76 meters. Attached by an arm to one side of the base and extending below the spacecraft was a large directional dish antenna.
        
        The Mariner 1 power system consisted of the two solar cell wings, one 183 cm by 76 cm and the other 152 cm by 76 cm (with a 31 cm dacron extension (a solar sail) to balance the solar pressure on the panels) which powered the craft directly or recharged a 1000 Watt-hour sealed silver-zinc cell battery, which was to be used before the panels were deployed, when the panels were not illuminated by the Sun, and when loads were heavy. A power-switching and booster regulator device controlled the power flow. Communications consisted of a 3 Watt transmitter capable of continuous telemetry operation, the large high gain directional dish antenna, a cylindrical omnidirectional antenna at the top of the instrument mast, and two command antennas, one on the end of either solar panel, which received instructions for midcourse maneuvers and other functions.
        
        Propulsion for midcourse maneuvers was supplied by a monopropellant (anhydrous hydrazine) 225 N retro-rocket. The hydrazine was ignited using nitrogen tetroxide and aluminum oxide pellets, and thrust direction was controlled by four jet vanes situated below the thrust chamber. Attitude control with a 1 degree pointing error was maintained by a system of nitrogen gas jets. The Sun and Earth were used as references for attitude stabilization. Overall timing and control was performed by a digital Central Computer and Sequencer. Thermal control was achieved through the use of passive reflecting and absorbing surfaces, thermal shields, and movable louvers.
        
        The scientific experiments were mounted on the instrument mast and base. A magnetometer was attached to the top of the mast below the omnidirectional antenna. Particle detectors were mounted halfway up the mast, along with the cosmic ray detector. A cosmic dust detector and solar plasma spectrometer detector were attached to the top edges of the spacecraft base. A microwave radiometer and an infrared radiometer and the radiometer reference horns were rigidly mounted to a 48 cm diameter parabolic radiometer antenna mounted near the bottom of the mast.
        
        Total research, development, launch, and support costs for the Mariner series of spacecraft (Mariners 1 through 10) was approximately $554 million.`,
        launchSite: 'Cape Canaveral, United States',
        mass: 202.8
    },
    {
        uuid: 'fb85f146-8acc-4d1d-8b37-0513ec7ca82f',
        name: 'Sputnik 19',
        celestialBody: 'Venus',
        launchDate: ' 25 August 1962',
        description: `Sputnik 19 was a Venera-type spacecraft intended to make a landing on Venus. The SL-6/A-2-e launcher put the spacecraft into Earth orbit on 25 August 1962, but the escape stage failed and the probe remained in geocentric orbit for three days until the orbit decayed on 28 August and it re-entered Earth's atmosphere.
        Spacecraft and Subsystems
        
        Sputnik 19 was a Venera-type (2MV-1) lander with power supplied by 2.6 square meters of solar panels powering a 42 amp/hr cadmium-nickel battery. Thermal control was achieved by epoxy-resin heat shields and an ammonia-based cooling system. Sun-Earth sensors were used for spacecraft pointing. Communications were via a 1 m wavelength omni-directional antenna, a 1.7 high-gain antenna at 5 cm, 8 cm, and 32 cm wavelengths, and a small antennae on the solar panels at 1.6 m wavelength. The spacecraft scientific payload comprised ultraviolet detectors, a chemical gas analyzer, temperature, density, and pressure sensors, a gamma-ray counter, movement detector, a surface gamma-ray detector, and a meteorite detector.
        Mission Profile
        
        After achieving Earth parking orbit a ullage maneuver was attempted to settle the fuel and point the block L 4th stage in the correct direction for Venus transfer firing. One of the four small solid-fuel rockets failed to fire, leaving the spacecraft pointed in the wrong direction. When the firing occurred, the spacecraft began to tumble violently and cut out from lack of fuel after 45 seconds. It remained in geocentric orbit for 3 days until the orbit decayed on 28 August and Sputnik 19 re-entered the Earth's atmosphere.
        
        This spacecraft was originally designated Sputnik 23 in the U.S. Naval Space Command Satellite Situation Summary.`,
        launchSite: 'Tyuratam (Baikonur Cosmodrome), U.S.S.R',
        mass: 890
    },
    {
        uuid: 'fe2e71bb-444e-4a67-a140-3d61feea29b9',
        name: 'Marina 2',
        celestialBody: 'Venus',
        launchDate: '27 August 1962',
        description: `The Mariner 2 spacecraft was the second of a series of spacecraft used for planetary exploration in the flyby, or nonlanding, mode and the first spacecraft to successfully encounter another planet. Mariner 2 was a backup for the Mariner 1 mission which failed shortly after launch to Venus. The objective of the Mariner 2 mission was to fly by Venus and return data on the planet's atmosphere, magnetic field, charged particle environment, and mass. It also made measurements of the interplanetary medium during its cruise to Venus and after the flyby.
        Spacecraft and Subsystems
        
        Mariner 2 consisted of a hexagonal base, 1.04 meters across and 0.36 meters thick, which contained six magnesium chassis housing the electronics for the science experiments, communications, data encoding, computing, timing, and attitude control, and the power control, battery, and battery charger, as well as the attitude control gas bottles and the rocket engine. On top of the base was a tall pyramid-shaped mast on which the science experiments were mounted which brought the total height of the spacecraft to 3.66 meters. Attached to either side of the base were rectangular solar panel wings with a total span of 5.05 meters and width of 0.76 meters. Attached by an arm to one side of the base and extending below the spacecraft was a large directional dish antenna.
        
        The Mariner 2 power system consisted of the two solar cell wings, one 183 cm by 76 cm and the other 152 cm by 76 cm (with a 31 cm dacron extension (a solar sail) to balance the solar pressure on the panels) which powered the craft directly or recharged a 1000 Watt-hour sealed silver-zinc cell battery, which was used before the panels were deployed, when the panels were not illuminated by the Sun, and when loads were heavy. A power-switching and booster regulator device controlled the power flow. Communications consisted of a 3 Watt transmitter capable of continuous telemetry operation, the large high gain directional dish antenna, a cylindrical omnidirectional antenna at the top of the instrument mast, and two command antennas, one on the end of either solar panel, which received instructions for midcourse maneuvers and other functions.
        
        Propulsion for midcourse maneuvers was supplied by a monopropellant (anhydrous hydrazine) 225 N retro-rocket. The hydrazine was ignited using nitrogen tetroxide and aluminum oxide pellets, and thrust direction was controlled by four jet vanes situated below the thrust chamber. Attitude control with a 1 degree pointing error was maintained by a system of nitrogen gas jets. The Sun and Earth were used as references for attitude stabilization. Overall timing and control was performed by a digital Central Computer and Sequencer. Thermal control was achieved through the use of passive reflecting and absorbing surfaces, thermal shields, and movable louvers.
        
        The scientific experiments were mounted on the instrument mast and base. A magnetometer was attached to the top of the mast below the omnidirectional antenna. Particle detectors were mounted halfway up the mast, along with the cosmic ray detector. A cosmic dust detector and solar plasma spectrometer detector were attached to the top edges of the spacecraft base. A microwave radiometer and an infrared radiometer and the radiometer reference horns were rigidly mounted to a 48 cm diameter parabolic radiometer antenna mounted near the bottom of the mast. All instruments were operated throughout the cruise and encounter modes except the radiometers, which were only used in the immediate vicinity of Venus.
        Mission Profile
        
        After launch and termination of the Agena first burn, the Agena-Mariner was in a 118 km altitude Earth parking orbit. The Agena second burn some 980 seconds later followed by Agena-Mariner separation injected the Mariner 2 spacecraft into a geocentric escape hyperbola at 26 minutes 3 seconds after lift-off. Solar panel extension was completed about 44 minutes after launch. On 29 August 1962 cruise science experiments were turned on. The midcourse maneuver was initiated at 22:49:00 UT on 4 September and completed at 2:45:25 UT 5 September. On 8 September at 17:50 UT the spacecraft suddenly lost its attitude control, which was restored by the gyroscopes 3 minutes later. The cause was unknown but may have been a collision with a small object. On October 31 the output from one solar panel deteriorated abruptly, and the science cruise instruments were turned off. A week later the panel resumed normal function and instruments were turned back on. The panel permanently failed on 15 November, but Mariner 2 was close enough to the Sun that one panel could supply adequate power. On December 14 the radiometers were turned on. Mariner 2 approached Venus from 30 degrees above the dark side of the planet, and passed below the planet at its closest distance of 34,773 km at 19:59:28 UT 14 December 1962. After encounter, cruise mode resumed. Spacecraft perihelion occurred on 27 December at a distance of 105,464,560 km. The last transmission from Mariner 2 was received on 3 January 1963 at 07:00 UT. Mariner 2 remains in heliocentric orbit.
        Scientific Results
        
        Scientific discoveries made by Mariner 2 included a slow retrograde rotation rate for Venus, hot surface temperatures and high surface pressures, a predominantly carbon dioxide atmosphere, continuous cloud cover with a top altitude of about 60 km, and no detectable magnetic field. It was also shown that in interplanetary space the solar wind streams continuously and the cosmic dust density is much lower than the near-Earth region. Improved estimates of Venus' mass and the value of the astronomical unit were made.
        
        Total research, development, launch, and support costs for the Mariner series of spacecraft (Mariners 1 through 10) was approximately $554 million.`,
        launchSite: 'Cape Canaveral, United States',
        mass: 202.8
    },
    {
        uuid: '915f5b3b-ec6b-42e9-b082-b89515d38b14',
        name: 'Sputnik 20',
        celestialBody: 'Venus',
        launchDate: ' 1 September 1962 ',
        description: `Sputnik 20 (1962 Alpha Tau 1) was intended to be a Venus landing mission. The Venera-type spacecraft was successfully inserted into geocentric orbit by the SL-6/A-2-e launcher on 1 September 1962. Ignition of the Block L engine to achieve Venus orbit failed when a fuel valve did not open and the spacecraft was stranded in Earth orbit until it re-entered the Earth's atmosphere 5 days later.
        Spacecraft and Subsystems
        
        Sputnik 20 was a Venera-type (2MV-1) lander with power supplied by 2.6 square meters of solar panels powering a 42 amp/hr cadmium-nickel battery. Thermal control was achieved by epoxy-resin heat shields and an ammonia-based cooling system. Sun-Earth sensors were used for spacecraft pointing. Communications were via a 1 m wavelength omni-directional antenna, a 1.7 high-gain antenna at 5 cm, 8 cm, and 32 cm wavelengths, and a small antennae on the solar panels at 1.6 m wavelength. The spacecraft scientific payload comprised ultraviolet detectors, a chemical gas analyzer, temperature, density, and pressure sensors, a gamma-ray counter, movement detector, a surface gamma-ray detector, and a meteorite detector.
        
        This spacecraft was originally designated Sputnik 24 in the U.S. Naval Space Command Satellite Situation Summary. `,
        launchSite: 'Tyuratam (Baikonur Cosmodrome), U.S.S.R',
        mass: 6500
    },
    {
        uuid: '203dad97-8551-47f5-bd20-8d22b1cf1df6',
        name: 'Sputnik 21',
        celestialBody: 'Venus',
        launchDate: ' 12 September 1962',
        description: `Sputnik 21 was an attempted Venus flyby mission. The SL-6/A-2-e launcher put the craft into Earth orbit, but the third stage exploded, destroying the spacecraft.

        This spacecraft was originally designated Sputnik 25 in the U.S. Naval Space Command Satellite Situation Summary.`,
        launchSite: 'Tyuratam (Baikonur Cosmodrome), U.S.S.R',
        mass: 6500
    },
    {
        uuid: 'f994ce91-4bd1-410b-8b9a-8653e9b40cad',
        name: 'Ranger 5',
        celestialBody: 'Moon',
        launchDate: '18 October 1962',
        description: `Ranger 5 was designed to transmit pictures of the lunar surface to Earth stations during a period of 10 minutes of flight prior to impacting on the Moon, to rough-land a seismometer capsule on the Moon, to collect gamma-ray data in flight, to study radar reflectivity of the lunar surface, and to continue testing of the Ranger program for development of lunar and interplanetary spacecraft. Due to an unknown malfunction, the spacecraft ran out of power and ceased operation. It passed within 725 km of the Moon.
        Spacecraft and Subsystems
        
        Ranger 5 was a Block II Ranger spacecraft similar to Rangers 3 and 4. The basic vehicle was 3.1 m high and consisted of a lunar capsule covered with a balsawood impact-limiter, 65 cm in diameter, a mono-propellant mid-course motor, a 5080-pound thrust retrorocket, and a gold- and chrome-plated hexagonal base 1.5 m in diameter. A large high-gain dish antenna was attached to the base. Two wing-like solar panels (5.2 m across) were attached to the base and deployed early in the flight. Power was generated by 8680 solar cells contained in the solar panels which charged a 11.5 kg 1000 W-hour capacity AgZn launching and backup battery. Spacecraft control was provided by a solid-state digital computer and sequencer and an earth-controlled command system. Attitude control was provided by six Sun and one Earth sensor, gyroscopes, and pitch and roll cold nitrogen gas jets. The telemetry system aboard the spacecraft consisted of two 960 MHz transmitters, one at 3 W power output and the other at 50 mW power output, the high-gain antenna, and an omnidirectional antenna. White paint, gold and chrome plating, and a silvered plastic sheet encasing the retrorocket furnished thermal control.
        
        The experimental apparatus included: (1) a vidicon television camera, which employed a scan mechanism that yielded one complete frame in 10 s; (2) a gamma-ray spectrometer in a 30 cm sphere mounted on a 1.8 m boom; (3) a radar altimeter; and (4) a seismometer to be rough-landed on the lunar surface. The seismometer was encased in the lunar capsule along with an amplifier, a 50-milliwatt transmitter, voltage control, a turnstile antenna, and 6 silver-cadmium batteries capable of operating the lunar capsule transmitter for 30 days, all designed to land on the Moon at 130 to 160 km/hr (80 -100 mph). The instrument package floated in a layer of freon within the balsawood sphere. The radar altimeter would be used for reflectivity studies, but was also designed to initiate capsule separation and ignite the retro-rocket.
        Mission Profile
        
        The mission was designed to boosted towards the Moon by an Atlas/Agena, undergo one mid-course correction, and impact the lunar surface. At the appropriate altitude the capsule was to separate and the retrorockets ignite to cushion the landing. Due to an unknown malfunction after injection into lunar trajectory from Earth parking orbit, the spacecraft failed to receive power. The batteries ran down after 8 hours, 44 minutes, rendering the spacecraft inoperable. Ranger 5 missed the Moon by 725 km. It is now in a heliocentric orbit. Gamma-ray data were collected for 4 hours prior to the loss of power.
        
        Total research, development, launch, and support costs for the Ranger series of spacecraft (Rangers 1 through 9) was approximately $170 million.`,
        launchSite: 'Cape Canaveral, United States',
        mass: 342.5
    },
    {
        uuid: '108894d6-092e-444c-b9bf-62bec74e0d8b',
        name: 'Sputnik 22',
        celestialBody: 'Mars',
        launchDate: '24 October 1962',
        description: `Sputnik 22 was an attempted Mars flyby mission, presumably similar to the Mars 1 mission launched 8 days later. The intended Mars probe had a mass of 893.5 kg. The spacecraft and attached upper stage, with a total mass of 6500 kg, were launched by an SL-6 into a 180 x 485 km Earth parking orbit with an inclination of 64.9 degrees and either broke up as they were going into Earth orbit or had the upper stage explode in orbit during the burn to put the spacecraft into Mars trajectory. In either case, the spacecraft broke into many pieces, some of which apparently remained in Earth orbit for a few days. (This occurred during the Cuban missile crisis. The debris was detected by the U.S. Ballistic Missile Early Warning System radar in Alaska and was momentarily feared to be the start of a Soviet nuclear ICBM attack.)

        This spacecraft was originally designated Sputnik 29 in the U.S. Naval Space Command Satellite Situation Summary.`,
        launchSite: 'Tyuratam (Baikonur Cosmodrome), U.S.S.R',
        mass: 6500
    },
    {
        uuid: '2537ea92-b9ec-44fa-bc1d-79fb9abc21b8',
        name: 'Mars 1',
        celestialBody: 'Mars',
        launchDate: '1 November 1962',
        description: `Mars 1 was the first spacecraft to fly by Mars, although communications had been lost before it reached the planet. It was an automatic interplanetary station launched with the intent of flying by Mars at a distance of about 11,000 km. It was designed to image the surface and send back data on cosmic radiation, micrometeoroid impacts and Mars' magnetic field, radiation environment, atmospheric structure, and possible organic compounds. After leaving Earth orbit, the spacecraft and the booster fourth stage separated and the solar panels were deployed. Early telemetry indicated that there was a leak in one of the gas valves in the orientation system so the spacecraft was transferred to gyroscopic stabilization. Sixty-one radio transmissions were held, initially at two day intervals and later at 5 days in which a large amount of interplanetary data were collected. On 21 March 1963, when the spacecraft was at a distance of 106,760,000 km from Earth on its way to Mars communications ceased, probably due to failure of the spacecraft orientation system. Mars 1 closest approach to Mars occurred on 19 June 1963 at a distance of approximately 193,000 km, after which the spacecraft entered a heliocentric orbit.
        Spacecraft and Subsystems
        
        Mars 1 was a modified Venera-type spacecraft in the shape of a cylinder 3.3 m long and 1.1 m in diameter with a mass of 893.5 kg. The spacecraft measured 4 meters across with the solar panels and radiators deployed. The cylinder was divided into two compartments. The upper 2.7 m, the orbital module, contained guidance and on-board propulsion systems. The experiment module, containing the scientific instrumentation, comprised the bottom 0.6 m of the cylinder. A 1.7 m parabolic high gain antenna was used for communication, along with an omnidirectional antenna and a semi-directional antenna. Power was supplied by two solar panel wings with a total area of 2.6 square meters affixed to opposite sides of the spacecraft. Power was stored in a 42 amp-hour cadmium-nickel battery. Positional and orientation knowledge were achieved through Sun and star sensors. The interior of the station was sealed with a pressure of 1.1 atm.
        
        Communications were via three radio systems, at 1.6 m, 32 cm, and 5 and 8 cm wavelengths. The 32-cm wavelength radio transmitter mounted in the orbital module used the high-gain antenna. This was supplemented by the 1.6 m wavelength range transmitter through the two omnidirectional antennae extending from the solar panels. The 8 centimeter wavelength transmitter mounted in the experiment module was designed to transmit the TV images. Also mounted in the experiment module was a 5-centimeter range impulse transmitter. The station is designed to transmit automatically at 2-day intervals initially (until Dec. 13) and then at 5-day intervals, and can be commanded from the ground to transmit. Temperature was maintained between 20 C and 30 C using a binary gas-liquid system with heat exchangers and hemispherical radiators mounted on the ends of the solar panels. The craft carried various scientific instruments including a magnetometer probe, mounted on a boom extending from the orbital compartment, television photographic equipment, a spectroreflexometer, radiation sensors (gas-discharge and scintillation counters), a spectrograph to study ozone absorption bands, a radio telescope (150 and 1500 m wavelengths), and a micrometeoroid instrument.
        Scientific Results
        
        The probe recorded one micrometeorite strike every two minutes at altitudes ranging from 6000 to 40,000 km due to the Taurids meteor shower and also recorded similar densities at distances from 20 to 40 million km. Magnetic field intensities of 3-4 gammas with peaks as high as 6-9 gammas were measured in interplanetary space and the solar wind was detected. Measurements of cosmic rays showed that their intensity had almost doubled since 1959. The radiation zones around the Earth were detected and their magnitude confirmed.
        
        This spacecraft is also referenced as Sputnik 23 and Mars 2MV-4. It was originally designated Sputnik 30 in the U.S. Naval Space Command Satellite Situation Summary.`,
        launchSite: 'Tyuratam (Baikonur Cosmodrome), U.S.S.R',
        mass: 893.5
    },
    {
        uuid: '651937f0-7773-4013-bea9-557f58f14466',
        name: 'Sputnik 24',
        celestialBody: 'Mars',
        launchDate: '4 November 1962',
        description: `Sputnik 24 was an attempted Mars lander mission. The SL-6/A-2-e launcher put the spacecraft and the attached booster upper stage into a 197 x 590 km Earth orbit with an inclination of 64.7 degrees. The total mass of the booster/spacecraft complex (the Tyazheliy Sputnik) was roughly 6500 kg, the Mars spacecraft component comprising about 890 kg of this. The complex broke up during the burn to transfer to Mars trajectory. Five large pieces were tracked by the U.S. Ballistic Missile Early Warning System. The geocentric orbit of the presumed booster decayed on 25 December 1962 and the Mars spacecraft orbit decayed and it re-entered Earth's atmosphere on 19 January 1963.

        This spacecraft was originally designated Sputnik 31 in the U.S. Naval Space Command Satellite Situation Summary.`,
        launchSite: 'Tyuratam (Baikonur Cosmodrome), U.S.S.R',
        mass: 890
    },
    {
        uuid: '9bbe4dc1-e0f8-4838-a67f-af0cf7e88601',
        name: 'Sputnik 25',
        celestialBody: 'Moon',
        launchDate: ' 4 January 1963',
        description: `This mission was an attempted lunar soft landing, with the purpose of returning data on the mechanical characteristics of the lunar surface, the hazards presented by the topology such as craters, rocks, and other obstructions, and radiation, in preparation for future manned landings. The 1500 kg spacecraft consisted of a cylindrical section containing maneuvering and landing rockets and fuel, orientation devices and radio transmitters and a spherical top containing the 100 kg lander. The lander would be ejected onto the surface after the main body touched down, carrying a camera and devices to measure radiation.

        The spacecraft was injected into Earth orbit successfully by the SL-6/A-2-e launcher but failed to escape orbit for its trip to the Moon. Its orbit decayed on 5 January 1963 after one day.
        
        Sputnik 25 was originally designated Sputnik 33 in the U.S. Naval Space Command Satellite Situation Summary.`,
        launchSite: 'Tyuratam (Baikonur Cosmodrome), U.S.S.R',
        mass: 2500
    }
]

export const hardCodedMissions: Mission[] = hardCodedMissionDetails.map(m => ({
    uuid: m.uuid,
    name: m.name,
    celestialBody: m.celestialBody,
    launchDate: m.launchDate,
}))