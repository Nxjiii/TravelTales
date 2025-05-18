import { getFollowers, getFollowing } from "./follow.js";

const username = localStorage.getItem("username");

const followersList = document.getElementById("followersList");
const followingList = document.getElementById("followingList");

async function renderFollowLists() {
  followersList.innerHTML = "<li>Loading...</li>";
  followingList.innerHTML = "<li>Loading...</li>";

  try {
    const [followers, following] = await Promise.all([
      getFollowers(username),
      getFollowing(username),
    ]);

    followersList.innerHTML = followers.length
      ? followers.map((f) => `<li>@${f.username}</li>`).join("")
      : "<li>No followers yet.</li>";

    followingList.innerHTML = following.length
      ? following.map((f) => `<li>@${f.username}</li>`).join("")
      : "<li>Not following anyone yet.</li>";
  } catch (err) {
    followersList.innerHTML = "<li>Error loading followers.</li>";
    followingList.innerHTML = "<li>Error loading following.</li>";
  }
}

if (username) {
  renderFollowLists();
} else {
  followersList.innerHTML = "<li>Username not found.</li>";
  followingList.innerHTML = "<li>Username not found.</li>";
}
