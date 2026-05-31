import { east, west } from "./players";
import type { TournamentData } from "../types";

const data: TournamentData = {
  tournament: {
    name: "Ryder Cup 2026",
    dates: "May 30–31, 2026",
    status: "upcoming",
    currentRound: 3,
    note: "Reminder - bring cash for closest to the pin. $5 per round.",
  },
  teams: {
    east: {
      name: "Team East",
      players: { ...east },
      hotel: {
        name: "Hotel V",
        mapsEmbed:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2797.4584756176055!2d-75.69651992408025!3d45.48071153233735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cce1b6abc2cf773%3A0xec3e2fb49049f93f!2sHotel%20V!5e0!3m2!1sen!2sca!4v1780233899051!5m2!1sen!2sca",
      },
      bus: {
        bookingId: "B-KD97Z3P",
        date: "Saturday, May 30",
        size: "24 Passenger Bus",
        arrivalNote: "Driver arrives 15 min before scheduled departure.",
        stops: [
          {
            time: "8:00 AM",
            from: "Hotel V (585 Bd de la Gappe)",
            to: "Gatineau Golf & Country Club (160 Rue du Golf)",
          },
          {
            time: "2:30 PM",
            from: "Gatineau Golf & Country Club",
            to: "Club de Golf Le Sorcier (967 Mnt Dalton)",
          },
          {
            time: "9:00 PM",
            from: "Club de Golf Le Sorcier",
            to: "Hotel V (585 Bd de la Gappe)",
          },
        ],
      },
    },
    west: {
      name: "Team West",
      players: { ...west },
      hotel: {
        name: "Adam Motel",
        mapsEmbed:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2798.230362651763!2d-75.70396122408113!3d45.465163233374966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cce1b4a1d97b297%3A0x9b679f62ceea5d1a!2sAdam%20Motel!5e0!3m2!1sen!2sca!4v1780233963430!5m2!1sen!2sca",
      },
    },
  },
  rounds: [
    // -------------------------------------------------------------------------
    // ROUND 1 — Gatineau Golf and Country Club | Modified Alt Shot + Best Ball
    // result options: 'east' | 'west' | 'halved' | null
    // Alt Shot: 1 pt | Best Ball: 1 pt | Halved: 0.5 pt each
    // -------------------------------------------------------------------------
    {
      id: "round1",
      name: "Gatineau",
      subtitle: "Mod. Alt Shot (Front 9) + Best Ball (Back 9)",
      date: "Saturday, May 30",
      startTime: "9:00 AM",
      course: "Gatineau Golf And Country Club",
      format: "alt_shot_best_ball",
      pointsNote:
        "Alternate Shot: 1 pt  |  Best Ball: 1 pt  |  Halved: 0.5 pt each",
      address: "160 Rue du Golf, Gatineau, QC J9J 0R1",
      mapsUrl: "https://maps.app.goo.gl/zdq2v1yqXdKc6mC88",
      mapsEmbed:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2801.19643203072!2d-75.81850272408437!3d45.40537833736199!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cce0227c0b9d001%3A0x7abcabb389811ebf!2sGatineau%20Golf%20%26%20Country%20Club!5e0!3m2!1sen!2sca!4v1780231812901!5m2!1sen!2sca",
      matches: [
        {
          id: "r1m1",
          teeTime: "9:00",
          east: [east.darryl, east.brandon],
          west: [west.reese, west.jackson],
          altShot: { result: "west" },
          bestBall: { result: "west" },
        },
        {
          id: "r1m2",
          teeTime: "9:10",
          east: [east.travis, east.coach],
          west: [west.miller, west.trav],
          altShot: { result: "west" },
          bestBall: { result: "east" },
        },
        {
          id: "r1m3",
          teeTime: "9:20",
          east: [east.graeme, east.devin],
          west: [west.brently, west.purves],
          altShot: { result: "east" },
          bestBall: { result: "west" },
        },
        {
          id: "r1m4",
          teeTime: "9:30",
          east: [east.glashan, east.tindal],
          west: [west.dacosta, west.hulton],
          altShot: { result: "halved" },
          bestBall: { result: "halved" },
        },
        {
          id: "r1m5",
          teeTime: "9:40",
          east: [east.justin, east.josh],
          west: [west.walsh, west.mosier],
          altShot: { result: "west" },
          bestBall: { result: "west" },
        },
      ],
    },

    // -------------------------------------------------------------------------
    // ROUND 2 — Sorcier 18 Holes | 2-Man Scramble Match Play
    // Front 9: 0.5 pt | Back 9: 0.5 pt | Overall: 1 pt | Halved: half each
    // -------------------------------------------------------------------------
    {
      id: "round2",
      name: "Le Sorcier",
      subtitle: "2-Man Scramble Match Play",
      date: "Saturday, May 30",
      startTime: "4:00 PM",
      course: "Club de Golf Le Sorcier",
      format: "scramble",
      pointsNote:
        "Front 9: 0.5 pt  |  Back 9: 0.5 pt  |  Overall: 1 pt  |  Halved: 0.5 points each",
      mapsEmbed:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d81612.63007273493!2d-75.57698781672626!3d45.54817494031557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cce19c926d1c063%3A0x985e857c281148a2!2sClub%20de%20Golf%20Le%20Sorcier!5e0!3m2!1sen!2sca!4v1780231658045!5m2!1sen!2sca",
      matches: [
        {
          id: "r2m1",
          teeTime: "4:00",
          east: [east.glashan, east.travis],
          west: [west.miller, west.reese],
          front9: { result: "west" },
          back9: { result: "west" },
          overall: { result: "west" },
        },
        {
          id: "r2m2",
          teeTime: "4:10",
          east: [east.brandon, east.graeme],
          west: [west.hulton, west.purves],
          front9: { result: "east" },
          back9: { result: "east" },
          overall: { result: "east" },
        },
        {
          id: "r2m3",
          teeTime: "4:20",
          east: [east.devin, east.justin],
          west: [west.jackson, west.dacosta],
          front9: { result: "halved" },
          back9: { result: "west" },
          overall: { result: "west" },
        },
        {
          id: "r2m4",
          teeTime: "4:30",
          east: [east.tindal, east.josh],
          west: [west.mosier, west.trav],
          front9: { result: "west" },
          back9: { result: "east" },
          overall: { result: "halved" },
        },
        {
          id: "r2m5",
          teeTime: "4:40",
          east: [east.darryl, east.coach],
          west: [west.brently, west.walsh],
          front9: { result: "west" },
          back9: { result: "east" },
          overall: { result: "west" },
        },
      ],
    },

    // -------------------------------------------------------------------------
    // ROUND 3 — Loch March 18 Holes | Individual Match Play
    // Win: 2 pts | Halved: 1 pt each
    // Fill in east/west player keys once matchups are set, e.g.:
    //   east: east.darryl,  west: west.reese
    // -------------------------------------------------------------------------
    {
      id: "round3",
      name: "Loch March",
      subtitle: "Individual Match Play",
      date: "Sunday, May 31",
      startTime: "9:00 AM",
      course: "Loch March Golf Club",
      format: "individual",
      pointsNote: "Win: 2 pts  |  Halved: 1 pt each",
      mapsEmbed:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2804.168031130299!2d-75.97962612408766!3d45.345420241356635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cd1ff668d33f0bf%3A0x9d9c9899bd95abac!2sLoch%20March%20Golf%20Club!5e0!3m2!1sen!2sca!4v1780231850889!5m2!1sen!2sca",
      matches: [
        {
          id: "r3m1",
          teeTime: "9:00",
          east: east.travis,
          west: west.mosier,
          result: null,
        },
        {
          id: "r3m2",
          teeTime: "9:10",
          east: east.graeme,
          west: west.brently,
          result: null,
        },
        { id: "r3m3", teeTime: "9:20", east: east.glashan, west: west.reese, result: null },
        { id: "r3m4", teeTime: "9:30", east: east.justin, west: west.dacosta, result: null },
        { id: "r3m5", teeTime: "9:40", east: east.brandon, west: west.jackson, result: null },
        { id: "r3m6", teeTime: "9:50", east: east.darryl, west: west.miller, result: null },
        { id: "r3m7", teeTime: "10:00", east: east.devin, west: west.walsh, result: null },
        { id: "r3m8", teeTime: "10:10", east: east.josh, west: west.trav, result: null },
        { id: "r3m9", teeTime: "10:20", east: east.coach, west: west.purves, result: null },
        { id: "r3m10", teeTime: "10:30", east: east.tindal, west: west.hulton, result: null },
      ],
    },
  ],
};

export default data;
