const mockProfile = {
  topArtistsByRange: {
    short_term: [
      { id: "a1", name: "Artist A", genres: ["indie pop", "alternative"] },
      { id: "a2", name: "Artist B", genres: ["hip hop", "rap"] },
      { id: "a3", name: "Artist C", genres: ["pop"] },
      { id: "a4", name: "Artist D", genres: ["electronic", "dance"] },
      { id: "a5", name: "Artist E", genres: ["rock"] }
    ],

    medium_term: [
      { id: "a1", name: "Artist A", genres: ["indie pop", "alternative"] },
      { id: "a2", name: "Artist B", genres: ["hip hop", "rap"] },
      { id: "a3", name: "Artist C", genres: ["pop"] },
      { id: "a6", name: "Artist F", genres: ["r&b", "soul"] },
      { id: "a7", name: "Artist G", genres: ["classical"] }
    ],

    long_term: [
      { id: "a1", name: "Artist A", genres: ["indie pop", "alternative"] },
      { id: "a3", name: "Artist C", genres: ["pop"] },
      { id: "a6", name: "Artist F", genres: ["r&b", "soul"] },
      { id: "a8", name: "Artist H", genres: ["metal", "rock"] },
      { id: "a9", name: "Artist I", genres: ["jazz"] }
    ]
  },

  topTracks: [
    {
      id: "t1",
      name: "Track One",
      artists: [{ id: "a1", name: "Artist A" }]
    },
    {
      id: "t2",
      name: "Track Two",
      artists: [{ id: "a2", name: "Artist B" }]
    },
    {
      id: "t3",
      name: "Track Three",
      artists: [{ id: "a3", name: "Artist C" }]
    },
    {
      id: "t4",
      name: "Track Four",
      artists: [{ id: "a4", name: "Artist D" }]
    },
    {
      id: "t5",
      name: "Track Five",
      artists: [{ id: "a1", name: "Artist A" }]
    }
  ],

  recentlyPlayed: [
    {
      track: {
        id: "t1",
        name: "Track One",
        artists: [{ id: "a1", name: "Artist A" }]
      },
      played_at: "2026-09-08T18:30:00Z"
    },
    {
      track: {
        id: "t1",
        name: "Track One",
        artists: [{ id: "a1", name: "Artist A" }]
      },
      played_at: "2026-09-08T17:10:00Z"
    },
    {
      track: {
        id: "t2",
        name: "Track Two",
        artists: [{ id: "a2", name: "Artist B" }]
      },
      played_at: "2026-09-08T16:45:00Z"
    },
    {
      track: {
        id: "t3",
        name: "Track Three",
        artists: [{ id: "a3", name: "Artist C" }]
      },
      played_at: "2026-09-07T20:15:00Z"
    }
  ]
};

module.exports = mockProfile;