import Feed from "../../components/feed/Feed";
import "../../components/feed/feed.css";
import MasterLayout from "../../masterLayout/MasterLayout";

export default function FeedPage() {
    return (
        <div className="">
            <MasterLayout>
                <Feed />
            </MasterLayout>
        </div>
    );
}