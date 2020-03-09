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
        celestialBody: 'Mars',
        launchDate: '23rd September 1958',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: '5981fd9e-aa94-4fe5-a36d-2fb95732a7c1',
        name: 'Pioneer 1',
        celestialBody: 'Mars',
        launchDate: '11 October 1958',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: '04bebdaa-1579-47a9-ae04-2ed58c3e2e23',
        name: 'Lunar 1958B',
        celestialBody: 'Mars',
        launchDate: '12th October 1958',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: '178292ff-9201-4c49-bc17-4f2c6e7cb004',
        name: 'Pioneer 2',
        celestialBody: 'Mars',
        launchDate: '8th November 1958',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: 'a05df834-ae82-4ff6-b459-39b4dbcb7acd',
        name: 'Lunar 1958C',
        celestialBody: 'Mars',
        launchDate: '4th December 1958',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: '618e4940-5153-4856-92aa-c40593e44d5b',
        name: 'Pioneer 3',
        celestialBody: '',
        launchDate: '6 December 1958',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: '91294df8-4163-4a1a-bd12-e9970f38fd94',
        name: 'Luna 1',
        celestialBody: '',
        launchDate: '2 January 1959',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: '077bbade-2be8-4570-9068-34bfd3f60544',
        name: 'Pioneer 4',
        celestialBody: '',
        launchDate: '3 March 1959',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: 'cbb2e304-466c-4805-a3eb-ce2f095dc3b4',
        name: 'Luna 1959A',
        celestialBody: '',
        launchDate: '16 June 1959',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: '38abda66-3b8d-4244-91ab-c883de27aa28',
        name: 'Luna 2',
        celestialBody: '',
        launchDate: '12 September 1959',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: 'a0229b57-6b86-421e-b10b-1096aa2b6ae1',
        name: 'Luna 3',
        celestialBody: '',
        launchDate: '4 October 1959',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: '4220ffc0-0962-4c6c-9754-e72d8d0e5759',
        name: 'Pioneer P-3',
        celestialBody: '',
        launchDate: '26 November 1959',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: 'e4408d31-5534-43d4-b555-a9aff942d646',
        name: 'Luna 1960A',
        celestialBody: '',
        launchDate: '15 April 1960 ',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: '1a6af8d0-a582-43a9-8362-8a1b5e6bf69c',
        name: 'Luna 1960B',
        celestialBody: '',
        launchDate: '18 April 1960',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: '8eec31fe-cd70-47a3-bf94-6171b1299d2b',
        name: 'Pioneer P-30',
        celestialBody: '',
        launchDate: '25 Sept 1960',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: '0d0816c6-6867-4b68-bad0-2b1f333380ce',
        name: 'Marsnik 1',
        celestialBody: '',
        launchDate: ' 10 October 1960',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: '1cf39956-9894-4685-a9b5-2386180bc3cc',
        name: 'Marsnik 2',
        celestialBody: '',
        launchDate: ' 14 October 1960',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: '23b1d0bb-8edd-4163-9988-9b253b048cb7',
        name: 'Pioneer P-31',
        celestialBody: '',
        launchDate: '15 December 1960',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: '8d512798-5985-4f55-8f08-3345310c5558',
        name: 'Sputnik 7',
        celestialBody: '',
        launchDate: ' 4 February 1961',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: '6f45c937-4149-45d8-bf75-46e80ea15da3',
        name: 'Venera 1',
        celestialBody: '',
        launchDate: ' 12 February 1961',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: '68a1dac9-44ca-4bd0-8ed0-bb604ead56a0',
        name: 'Ranger 1',
        celestialBody: '',
        launchDate: '23 August 1961 ',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: '70544077-cd17-45b3-844c-73fec1f5adef',
        name: 'Ranger 2',
        celestialBody: '',
        launchDate: ' 18 November 1961',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: '5e4ea216-00a9-4ba8-bb3f-adabcf622764',
        name: 'Ranger 3',
        celestialBody: '',
        launchDate: '26 January 1962',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: '76c8ba3c-dd1f-46fa-b49c-2ef58289fbce',
        name: 'Ranger 4',
        celestialBody: '',
        launchDate: '23 April 1962',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: '92dc457c-3677-4140-887f-e2700425ce23',
        name: 'Marina 1',
        celestialBody: '',
        launchDate: ' 22 July 1962',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: 'fb85f146-8acc-4d1d-8b37-0513ec7ca82f',
        name: 'Sputnik 19',
        celestialBody: '',
        launchDate: ' 25 August 1962',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: 'fe2e71bb-444e-4a67-a140-3d61feea29b9',
        name: 'Marina 2',
        celestialBody: '',
        launchDate: '27 August 1962',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: '915f5b3b-ec6b-42e9-b082-b89515d38b14',
        name: 'Sputnik 20',
        celestialBody: '',
        launchDate: ' 1 September 1962 ',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: '203dad97-8551-47f5-bd20-8d22b1cf1df6',
        name: 'Sputnik 21',
        celestialBody: '',
        launchDate: ' 12 September 1962',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: 'f994ce91-4bd1-410b-8b9a-8653e9b40cad',
        name: 'Ranger 5',
        celestialBody: '',
        launchDate: '18 October 1962',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: '108894d6-092e-444c-b9bf-62bec74e0d8b',
        name: 'Sputnik 22',
        celestialBody: '',
        launchDate: '24 October 1962',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: '2537ea92-b9ec-44fa-bc1d-79fb9abc21b8',
        name: 'Mars 1',
        celestialBody: '',
        launchDate: ' 1 November 1962',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: '651937f0-7773-4013-bea9-557f58f14466',
        name: 'Sputnik 24',
        celestialBody: '',
        launchDate: '4 November 1962',
        description: '',
        launchSite: '',
        mass: 0
    },
    {
        uuid: '9bbe4dc1-e0f8-4838-a67f-af0cf7e88601',
        name: 'Sputnik 25',
        celestialBody: '',
        launchDate: ' 4 January 1963',
        description: '',
        launchSite: '',
        mass: 0
    }
]

export const hardCodedMissions: Mission[] = hardCodedMissionDetails.map(m => ({
    uuid: m.uuid,
    name: m.name,
    celestialBody: m.celestialBody,
    launchDate: m.launchDate,
}))