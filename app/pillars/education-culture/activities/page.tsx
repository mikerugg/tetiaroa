import { getEducationActivitiesMetadata } from "../../education-activities-metadata";
import { EducationActivitiesPage } from "../../education-activities-page";

export const metadata = getEducationActivitiesMetadata("en");

export default function EnglishEducationActivities() {
  return <EducationActivitiesPage locale="en" />;
}
