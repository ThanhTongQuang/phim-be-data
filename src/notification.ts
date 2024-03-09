import { Message, getMessaging } from "firebase-admin/messaging";
import { MovieSchema } from "./mongoose/movie";
import { SubscriptionSchema } from "./mongoose/subscription";
import { UserSchema } from "./mongoose/user";

export const checkNotification = async (result: boolean): Promise<void> => {
  if (!result) {
    return;
  }
  try {
    const users = await UserSchema.find({});
    const subscriptions = await SubscriptionSchema.find({});
    for (const user of users) {
      if (user.fcmToken && user.slugs.length > 0) { //  && (user.email?.includes('tongquangthanh') || user.email?.includes('toan65'))
        const slugs = [];
        for (const slug of user.slugs) {
          const subscription = subscriptions.find(x => x.slug === slug);
          if (subscription) {
            const movie = await MovieSchema.findOne({ slug });
            if (movie?.status !== subscription.status || movie.currentTotalEpisode > (subscription.currentTotalEpisode || 0)) {
              slugs.push(slug);
            }
          }
        }
        const message: Message = {
          notification: { title: `${user.name} ôi bạn ơi`, body: "Phim nóng hổi, vào thổi mà xem ngay nhé!", imageUrl: "https://lh3.googleusercontent.com/XEVixiPC1G6tjOtpE36WV1a1-fBRcJoxfSwhmRn6X3e3RbIjTyVBk8klDnoL02sJxrk" },
          token: user.fcmToken,
          data: { slugs: slugs.join() },
        };
        getMessaging().send(message).then(_ => console.log("[Firebase-messaging] Successfully sent message to: ", user.name))
          .catch(error => {
            console.log(`[Firebase-messaging] ERROR on sent message to ${user.name}: `, error);
            user.deleteOne().then(del => console.log(`[Firebase-messaging] Deleted user ${del.name}: `));
          });
      }
    }
  } catch (error) {
    console.error("[Firebase-messaging] Error sent message: ", error);
  }
}
