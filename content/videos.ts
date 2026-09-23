import { media } from "./media";
import type { Video } from "./types";

/**
 * Drop real files into /public/videos (or set a `youtubeId`) — the players
 * pick them up automatically. Until then, the poster and title are shown.
 */
export const introVideo: Video = {
  id: "clinic-tour",
  title: { ar: "جولة داخل العيادة مع د. أحمد سليمان", en: "A tour of the clinic with Dr. Ahmed Soliman" },
  duration: "2:45",
  poster: media.consultation,
  src: "/videos/clinic-tour.mp4",
};

/** Nine short vertical videos. The first three are featured on the home page. */
export const videos: Video[] = [
  {
    id: "knee-pain",
    title: { ar: "٥ أسباب شائعة لألم الركبة", en: "5 common causes of knee pain" },
    duration: "0:58",
    poster: media.running,
    src: "/videos/knee-pain.mp4",
  },
  {
    id: "acl",
    title: { ar: "متى يحتاج الرباط الصليبي لجراحة؟", en: "When does an ACL tear need surgery?" },
    duration: "1:12",
    poster: media.scrubs,
    src: "/videos/acl.mp4",
  },
  {
    id: "prp-explained",
    title: { ar: "حقن البلازما: كل ما تريد معرفته", en: "PRP injections, explained" },
    duration: "1:04",
    poster: media.prp,
    src: "/videos/prp-explained.mp4",
  },
  {
    id: "back-posture",
    title: { ar: "وضعية الجلوس الصحيحة لظهرك", en: "The right sitting posture for your back" },
    duration: "0:47",
    poster: media.phone,
    src: "/videos/back-posture.mp4",
  },
  {
    id: "warm-up",
    title: { ar: "إحماء ٣ دقائق يحميك من الإصابة", en: "A 3-minute warm-up that prevents injury" },
    duration: "0:52",
    poster: media.exercise,
    src: "/videos/warm-up.mp4",
  },
  {
    id: "after-surgery",
    title: { ar: "أول ٤٨ ساعة بعد المنظار", en: "The first 48 hours after arthroscopy" },
    duration: "1:20",
    poster: media.masked,
    src: "/videos/after-surgery.mp4",
  },
  {
    id: "shoulder",
    title: { ar: "آلام الكتف عند الرياضيين", en: "Shoulder pain in athletes" },
    duration: "1:05",
    poster: media.yoga,
    src: "/videos/shoulder.mp4",
  },
  {
    id: "osteoarthritis",
    title: { ar: "خشونة الركبة: هل يمكن إيقافها؟", en: "Knee osteoarthritis: can it be stopped?" },
    duration: "1:15",
    poster: media.checkup,
    src: "/videos/osteoarthritis.mp4",
  },
  {
    id: "bone-health",
    title: { ar: "غذاء لعظام أقوى", en: "Eating for stronger bones" },
    duration: "0:55",
    poster: media.care,
    src: "/videos/bone-health.mp4",
  },
];

export const featuredVideos = videos.slice(0, 3);
