import type { StationApplicationMessages } from "./validation";

export type StationApplicationFormCopy = {
  title: string;
  description: string;
  managerNote: string;
  fields: {
    name: { label: string; placeholder: string };
    email: { label: string; placeholder: string };
    institution: { label: string; placeholder: string; description: string };
    role: { label: string; placeholder: string };
    projectTitle: { label: string; placeholder: string };
    projectType: { legend: string; description: string };
    dates: { legend: string; description: string };
    arrival: { label: string };
    departure: { label: string };
    partySize: { label: string; placeholder: string };
    summary: { label: string; placeholder: string; description: string };
    acknowledgement: { legend: string; label: string; description: string };
  };
  submitLabel: string;
  pendingLabel: string;
  successTitle: string;
  successMessage: string;
  errorTitle: string;
  genericError: string;
  validation: StationApplicationMessages;
};

export const stationApplicationCopy: StationApplicationFormCopy = {
  title: "Start your application",
  description:
    "This reaches the station manager, who will tell you which permits your project needs and whether your dates work. It is the first step, not the whole application — the formal one is filed in RAMS.",
  managerNote:
    "Expect a reply within a few working days. The atoll is on Tahiti time (UTC−10).",
  fields: {
    name: { label: "Your name", placeholder: "First and last name" },
    email: { label: "Email", placeholder: "you@university.edu" },
    institution: {
      label: "Institution or organisation",
      placeholder: "University, agency, or organisation",
      description: "Where the project is based. Write “Independent” if it isn't.",
    },
    role: { label: "Your role", placeholder: "Select your role" },
    projectTitle: {
      label: "Project title",
      placeholder: "A working title is fine",
    },
    projectType: {
      legend: "Project type",
      description: "Projects may be scientific, educational, or cultural.",
    },
    dates: {
      legend: "Dates you have in mind",
      description:
        "Optional, and not binding. Leave blank if the field season isn't set yet.",
    },
    arrival: { label: "Arrival" },
    departure: { label: "Departure" },
    partySize: {
      label: "How many people",
      placeholder: "Select a party size",
    },
    summary: {
      label: "What you want to do",
      placeholder:
        "What are you asking, what will you need on site, and who is funding it?",
      description:
        "A short paragraph is enough. Mention lab, boat, or dive needs, and any Scientific Advisory Board member already sponsoring the work.",
    },
    acknowledgement: {
      legend: "Before you send",
      label:
        "I understand the full process takes three to six months, and that projects need Scientific Advisory Board sponsorship and full funding to be approved.",
      description:
        "Nothing is approved in anticipation of future funding.",
    },
  },
  submitLabel: "Send to the station manager",
  pendingLabel: "Sending…",
  successTitle: "Your enquiry is on its way",
  successMessage:
    "The station manager has it. You'll hear back with guidance on permits and dates — then you can file the formal application in RAMS.",
  errorTitle: "That didn't send",
  genericError:
    "Something went wrong on our end. Please try again, or write to us from the contact page.",
  validation: {
    nameRequired: "Please add your name.",
    nameTooLong: "That name is too long.",
    emailRequired: "Please add an email address.",
    emailInvalid: "That doesn't look like an email address.",
    emailTooLong: "That email address is too long.",
    institutionRequired: "Please add your institution or organisation.",
    institutionTooLong: "That is too long.",
    roleRequired: "Please select your role.",
    roleInvalid: "Please select a role from the list.",
    projectTitleRequired: "Please add a project title.",
    projectTitleTooLong: "That title is too long.",
    projectTypeRequired: "Please choose a project type.",
    projectTypeInvalid: "Please choose a project type from the list.",
    dateInvalid: "Please use a valid date.",
    departureBeforeArrival: "Departure can't be before arrival.",
    partySizeRequired: "Please tell us how many people are coming.",
    partySizeInvalid: "Please select a party size from the list.",
    summaryRequired: "Please describe what you want to do.",
    summaryTooShort: "A sentence or two more, please.",
    summaryTooLong: "That is longer than we can accept here.",
    acknowledgementRequired: "Please confirm you've read this.",
  },
};
