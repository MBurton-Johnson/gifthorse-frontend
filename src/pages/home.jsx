// Import the react JS packages
import { useEffect, useState } from "react";
import axios from "axios";
// import wavyLine from '../assets/wavyline2.png';
import '../styles/pages/home.css';

// Define the Login function.
const Home = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (localStorage.getItem("access_token") === null) {
      window.location.href = "/login";
    } else {
      (async () => {
        try {
          const { data } = await axios.get("http://localhost:8000/home/", {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            },
          });
          setMessage(data.message);
        } catch (e) {
          console.log("not auth");
        }
      })();
    }
  }, []);
  
  return (
    <div>
      <div className="home-container">
        <img src="/horse2.jpeg" alt="horse-and-dog" className="home-image"/>
        <div className="greeting-message">
          <h3>{message}</h3>
        </div>
      </div>
      <div className="intro-text">
        <p>
        GiftHorse is an innovative website designed to revolutionize the way you manage and track gifts for your friends and family. In the hustle of daily life, keeping track of what you've bought, for whom, and for which occasion can be a daunting task. GiftHorse simplifies this process, making it not just manageable but enjoyable.

This user-friendly platform allows you to add gifts, recipients, and various occasions such as birthdays, Christmas, anniversaries, and more. Whether it’s a small token of appreciation or a grand gesture for a special event, GiftHorse ensures that every gift is accounted for.
</p>
<p>
One of the standout features of GiftHorse is its ability to help you monitor your spending. You can easily see how much you've invested in making your loved ones feel special, helping you to budget effectively for future occasions.

Beyond just tracking gifts, GiftHorse serves as a personal assistant in gift-giving. It helps you remember important dates, ensuring you never miss an opportunity to show your affection. Additionally, it offers a historical view of the gifts given, aiding in avoiding repetitions and ensuring each gift is as unique as its recipient.
</p>
<p>
GiftHorse is more than just a gift tracker; it's a platform that fosters thoughtful giving and helps strengthen bonds with those you care about. It’s your go-to solution for managing gifts, saving time, and enriching relationships, one gift at a time.
        </p>
      </div>
    </div>
  );
};

export default Home;