import { MessageSquareQuote } from "lucide-react";
import StarRating, { RatingSummary } from "@/components/reviews/StarRating";
import UserAvatar from "@/components/shared/UserAvatar";
import { formatDate } from "@/lib/format";
import type { ServiceReview } from "@/types";

type Props = { reviews: ServiceReview[]; average: number; count: number };

export default function ReviewList({ reviews, average, count }: Props) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Customer reviews</h2>
        <RatingSummary average={average} count={count} />
      </div>

      {reviews.length === 0 ? (
        <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed bg-card px-6 py-10 text-center">
          <MessageSquareQuote className="h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-medium">No reviews yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Customers can leave a review once their repair is completed. Be the first to book this service.
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-4">
          {reviews.map((r) => (
            <li key={r._id} className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <UserAvatar name={r.customerName} className="h-10 w-10 border" fallbackClassName="bg-secondary text-xs font-semibold text-white" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    <p className="font-semibold">{r.customerName}</p>
                    <time dateTime={r.createdAt} className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</time>
                  </div>
                  <StarRating value={r.rating} className="mt-1 h-4 w-4" />
                  {r.comment && <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">{r.comment}</p>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {count > reviews.length && (
        <p className="mt-3 text-center text-xs text-muted-foreground">Showing the {reviews.length} most recent of {count} reviews.</p>
      )}
    </div>
  );
}
