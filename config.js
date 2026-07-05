/* =============================================================================
   DECK CONFIG — the ONE file you edit to make a new deck.
   Loaded by deck.html, index.html and presenter.html.

   1. Paste your Supabase URL + publishable key below.
   2. Set your brand + copy.
   3. Define the `flow` — each entry is one attendee checkpoint.
   4. Replace the slides in deck.html (content only; the engine stays).

   Interaction types supported per flow entry:
     - "single" : pick exactly one chip
     - "multi"  : pick many chips (optional max + exclusive keys)
     - "quiz"   : a run of Yes/No questions -> a verdict picked by #yes
     - "text"   : one open-ended answer in a textarea (optional; free text)
   Copy an existing entry to add a checkpoint. Everything downstream
   (attendee flow, presenter panels, room map) is derived from this array.
   ============================================================================= */
window.DECK_CONFIG = {

  /* ---- Supabase — ONE shared "presentation platform" DB for all decks -------
     Every deck points at the same project + shared pres_* tables (schema.sql).
     Publishable key is safe to ship in client HTML: RLS locks writes to the
     anon role and never exposes the leads table for reading. ------------------*/
  supabase: {
    url: "https://hhqlzcvwalwuxrrolevv.supabase.co",
    publishableKey: "sb_publishable_oNq7GfsgbZKELDhQbaRz_g_ctOO0v0p"
  },

  /* WHICH presentation/event this is. Stamped on every lead, answer and question
     so exported leads always carry their source. Give each deck/session a unique
     slug — that is how the shared DB keeps events apart. */
  event: "deck",

  /* Advanced: override the shared table names (defaults to pres_leads / pres_answers
     / pres_questions / pres_state). Rarely needed. */
  // tables: { leads:"pres_leads", answers:"pres_answers", questions:"pres_questions", state:"pres_state" },

  /* localStorage namespace — bump the suffix to reset returning devices. */
  storagePrefix: "deck_v1",

  /* ---- Brand + links -------------------------------------------------------*/
  brand: {
    name:       "Presenter Kit",
    tagline:    "Turn the room you just presented to into leads.",
    presenter:  "Nicholas",                 // used in gate/waiting copy
    logo:       "brand-logo.svg",            // dark logo (attendee, light bg)
    logoWhite:  "brand-logo.svg",            // light logo (dark bg: card head, presenter)
    // shown on the finale card end-screen (the ACTUAL attendee's view). This is
    // the audience take-away: the slides themselves + a way to reach the speaker.
    // (The "get the template" path lives on the deck's closing slide, not here —
    // that's a builder action, not an attendee one.)
    links: [
      { label: "Get the slides →",        href: "deck.html", primary: true },
      { label: "Connect with Nicholas →", href: "https://nicholaschong.xyz", primary: false }
    ]
  },

  /* ---- Registration screen -------------------------------------------------*/
  register: {
    kicker: "60 seconds",
    title:  "Be my audience for a <em>minute.</em>",
    lede:   "This is the phone half of this thing. Register like you would at a real talk, answer a few things, and I'll show you what I could see the whole time. And yes — the name and email are the point.",
    cta:    "I'm in",
    fields: [
      { id:"name",    label:"Name",    type:"text",  required:true,  err:"Pop your name in — the summary's yours to keep." },
      { id:"company", label:"Company", type:"text",  required:true,  err:"Company or project — whatever you'd put on a badge." },
      { id:"email",   label:"Email",   type:"email", required:true,  err:"Needs a real email — that's where a follow-up would land." },
      { id:"role",    label:"Role",    type:"text",  required:false, optional:true }
    ]
  },

  /* ---- The flow: one entry per checkpoint ----------------------------------*/
  flow: [
    {
      id:"cp0", type:"single", gate:0,
      kicker:"Warm-up", cp:"CP0 · Your world",
      title:"So, what's your <em>world?</em>",
      cta:"That's me",
      options:[
        { k:"founder",    n:"Founder / operator",  sub:"Running or building a business." },
        { k:"gtm",        n:"Sales / marketing",   sub:"You bring in the pipeline." },
        { k:"consultant", n:"Consultant / coach",  sub:"Advising, on your own shingle." },
        { k:"educator",   n:"Educator / trainer",  sub:"You teach rooms for a living." },
        { k:"other",      n:"Something else",       sub:"Doesn't fit the boxes above." }
      ]
    },
    {
      id:"cp1", type:"multi", gate:1, max:2,
      kicker:"Checkpoint 1", cp:"What you present",
      title:"What do you <em>present most?</em>",
      lede:"Pick all that apply.",
      pickhint:"Pick up to 2.",
      cta:"That's me",
      options:[
        { k:"pitch",    n:"Pitch / investor deck", sub:"Raising, or making the case for it." },
        { k:"workshop", n:"Workshop / training",   sub:"Teaching a room something new." },
        { k:"talk",     n:"Conference talk",       sub:"On a stage, one to many." },
        { k:"demo",     n:"Sales demo",            sub:"Showing the product to a buyer." },
        { k:"internal", n:"Internal update",       sub:"Team, leadership, the all-hands." }
      ]
    },
    {
      id:"cp2", type:"multi", gate:2, max:2, exclusive:["nothing"],
      kicker:"Checkpoint 2", cp:"The gap · pick up to 2",
      title:"After you present, what <em>happens to the room?</em>",
      lede:"Be honest — pick up to two. Nobody's watching but the tally.",
      pickhint:"Pick up to 2.",
      options:[
        { k:"forget",   n:"They forget me",           sub:"No trace once the room empties out." },
        { k:"chase",    n:"I chase them by hand",      sub:"Emails, DMs, a spreadsheet after the fact." },
        { k:"linkedin", n:"A few LinkedIn adds",       sub:"Some signal, but thin and slow." },
        { k:"wish",     n:"I wish I had their details", sub:"No decent way to follow up." },
        { k:"nothing",  n:"I capture nothing",         sub:"Honestly? Nothing comes out of it." }
      ]
    },
    {
      id:"cp3", type:"single", gate:3,
      kicker:"Checkpoint 3", cp:"Next step",
      title:"Would you use something <em>like this?</em>",
      cta:"That's me",
      options:[
        { k:"try",   n:"Yes — on my next one",   sub:"See it work for real, on my own room." },
        { k:"maybe", n:"Maybe — show me more",   sub:"Not sold yet — want the details." },
        { k:"no",    n:"Not for me",              sub:"Doesn't fit what I do." }
      ]
    },
    {
      id:"cp4", type:"text", gate:4, optional:true,
      kicker:"Last one", cp:"Open floor",
      title:"What do you wish this could do — but <em>can’t?</em>",
      lede:"Anything — the feature you’d want, the part that always trips you up, the thing you’d change. I read every one; it’s how I decide what to build next.",
      placeholder:"The thing you’d change…",
      cta:"Send it"
    }
  ],

  /* ---- Finale card ---------------------------------------------------------*/
  finale: {
    kicker:"That's the trick", cp:"You're a lead now",
    title:"You're now a lead <em>in my pipeline.</em>",
    cardLabel:"Your summary card",
    passLabel:"Presenter Kit · you just tried it",
    /* which flow answers to print on the card, top to bottom
       (cp4 is open text — it's in the room feed, not on the card): */
    stops:[
      { cp:"cp0", label:"Your world" },
      { cp:"cp1", label:"What you present" },
      { cp:"cp2", label:"The gap" },
      { cp:"cp3", label:"Would you use it" }
    ],
    /* recap = the line printed on the summary card itself; note = the sign-off
       shown after they tap Done. Kept separate so nothing repeats. */
    recap:"That's the trick. You answered a few questions, and now you're a qualified lead in my table — sorted by what you actually said.",
    note:"That's the whole loop — you just tried it from the inside. <b>Take the slides with you, and let's keep talking.</b>",
    footer:"turn the room into leads"
  },

  /* ---- Presenter live view -------------------------------------------------*/
  presenter: {
    title:"Live Room Map",
    footer:"Presenter Kit · live audience view"
  }
};
