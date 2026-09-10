/**
 * What translated phone calls can actually do, as data (spec 0111, "WEBSITE CONTENT").
 *
 * The marketing page's claims and its FAQ are **generated from this file**, so a promise
 * cannot get ahead of the build. That is not a stylistic preference: the two things this
 * product must never overstate are GDPR posture and mainland-China support, and both are
 * exactly the questions a buyer asks first.
 *
 * Every `false` here is a real limitation, and each one carries the reason next to it so
 * that flipping it later is a decision someone has to justify rather than a checkbox.
 *
 * Keep in step with `docs/voip-data-flow.md` and `docs/voip-china-validation.md` in the
 * server repository. Where they disagree, those documents describe the running system and
 * this file is the one that is wrong.
 */

export interface PhoneCapability {
  /** Whether we say yes on the public site today. */
  available: boolean;
  /** Why, in the customer's language. Rendered verbatim, so write it as prose. */
  note: string;
}

export const PHONE_CAPABILITIES = {
  /** Calling a normal telephone — the whole product. */
  outboundCalls: {
    available: true,
    note: 'You call an ordinary telephone number and speak your language. The person you call hears theirs, on a normal phone call.',
  },
  /** The recipient needs nothing. */
  recipientNeedsNothing: {
    available: true,
    note: 'No account, no app, no browser and no internet connection. Their phone simply rings.',
  },
  mobiles: {
    available: true,
    note: 'Mobile and landline numbers are both supported, in every country your organisation allows.',
  },
  /** Receiving calls on a number you own. */
  inbound: {
    available: false,
    note: 'Not yet. Outbound calling is available first; receiving calls on a number your organisation owns is next.',
  },
  /** Two ordinary telephones bridged through the translation. */
  pstnBridge: {
    available: false,
    note: 'Not yet. Today one side is VoxTranslate and the other is a telephone.',
  },
  recording: {
    available: true,
    note: 'Optional, off by default, and controlled per organisation. When it is on, the person you call is told before anything is recorded.',
  },
  transcription: {
    available: true,
    note: 'Optional. Transcripts land in the same place as your meeting transcripts, and can be attached to a project.',
  },
  aiSummaries: {
    available: true,
    note: 'Optional summaries and sentiment over the call transcript, using the same AI features as your meetings.',
  },
  video: {
    available: false,
    note: 'Not to a telephone — telephones carry voice. An upgrade that sends the person you called a one-time link into a browser video room is in development.',
  },
  ownNumber: {
    available: true,
    note: 'Your organisation can present a number it owns and has verified with the carrier. We do not allow arbitrary caller ID, because in most of our markets that is illegal.',
  },
  /**
   * The two that must not be overstated.
   *
   * China: gated off in code until a call to a real handset physically in mainland China
   * has been placed and its results recorded. A VPN test does not count.
   */
  china: {
    available: false,
    note: 'Not yet. A telephone call to China is a carrier call rather than an internet connection, so the technical picture is promising — but we will not claim it until we have placed real calls to real handsets in mainland China and published what we measured.',
  },
  /**
   * EU-only processing. Telephony and media are in Frankfurt; the AI translation is not.
   * Saying otherwise is the single most expensive sentence this page could contain.
   */
  euOnlyProcessing: {
    available: false,
    note: 'Telephony, call media, recordings and stored data are handled in the EU. The AI translation itself currently runs with providers outside the EU, so we do not claim EU-only processing. We publish exactly which step goes where.',
  },
  euInfrastructure: {
    available: true,
    note: 'Calls are carried and anchored in Frankfurt, and transcripts, recordings and call records are stored in the EU.',
  },
} satisfies Record<string, PhoneCapability>;

export type PhoneCapabilityKey = keyof typeof PHONE_CAPABILITIES;

/** The capabilities we are prepared to advertise. */
export function availableCapabilities(): PhoneCapabilityKey[] {
  return (Object.keys(PHONE_CAPABILITIES) as PhoneCapabilityKey[]).filter(
    (k) => PHONE_CAPABILITIES[k].available,
  );
}

export interface PhoneFaq {
  question: string;
  answer: string;
}

/**
 * The FAQ, generated from the capabilities above.
 *
 * Written this way so that "Can I call China?" cannot say yes while the code says no. The
 * answers to the honest-no questions read as a plan rather than a refusal, which is both
 * truer and better sales copy than an evasion.
 */
export function phoneFaq(): PhoneFaq[] {
  const c = PHONE_CAPABILITIES;
  return [
    {
      question: 'Does the person I call need VoxTranslate?',
      answer: c.recipientNeedsNothing.note,
    },
    {
      question: 'Can I call mobile phones and landlines?',
      answer: c.mobiles.note,
    },
    {
      question: 'Can I call China?',
      answer: c.china.note,
    },
    {
      question: 'Can I receive calls?',
      answer: c.inbound.note,
    },
    {
      question: 'Can calls be recorded?',
      answer: c.recording.note,
    },
    {
      question: 'Does VoxTranslate tell the other person what is happening?',
      answer:
        'Yes, and this is not optional when anything is being kept. Before a call is recorded or transcribed, we play a short spoken announcement in the language that person is hearing, saying what is being done. Depending on your organisation’s policy they may also be asked to press a key to agree; if they decline, the call can continue without recording, or end — you choose which.',
    },
    {
      question: 'Can I use my own number as the caller ID?',
      answer: c.ownNumber.note,
    },
    {
      question: 'Can I make video calls to a telephone?',
      answer: c.video.note,
    },
    {
      question: 'How much does it cost?',
      answer:
        'Calls are billed from your organisation’s existing credit balance — there is no second currency. The price per minute depends on the destination and the translation tier, and it is shown before you dial, together with your balance. Credits are held when the call starts and settled against the real duration when it ends; anything unused comes straight back.',
    },
    {
      question: 'Is this GDPR compliant?',
      answer: `${c.euInfrastructure.note} ${c.euOnlyProcessing.note} We would rather tell you exactly where each step runs than give you a one-word answer that does not survive an audit.`,
    },
    {
      question: 'What happens to recordings?',
      answer:
        'They are stored in the EU, kept for the retention period your organisation sets, and can be deleted at any time. Deleting one removes it from storage and from the search index, not just from the list.',
    },
    {
      question: 'Which translation tiers can I use?',
      answer:
        'The same tiers as your meetings. The tier decides which languages are available, which models do the speech and the translation, the latency you can expect and the price per minute.',
    },
  ];
}
