import React, { useState, useEffect, useRef } from "react";
import AddRoomModal from "../../components/AddRoomModal/AddRoomModal";
import RoomCard from "../../components/RoomCard/RoomCard";
import styles from "./Rooms.module.css";
import { useIntersection } from "@mantine/hooks";
import { getAllRooms } from "../../http";

// const rooms = [
//   {
//     id: 1,
//     topic: "Which framework best for frontend ?",
//     speakers: [
//       {
//         id: 1,
//         name: "John Doe",
//         avatar: "/images/default_img.png",
//       },
//       {
//         id: 2,
//         name: "Jane Doe",
//         avatar: "/images/default_img.png",
//       },
//     ],
//     totalPeople: 40,
//   },
//   {
//     id: 3,
//     topic: "What’s new in machine learning?",
//     speakers: [
//       {
//         id: 1,
//         name: "John Doe",
//         avatar: "/images/default_img.png",
//       },
//       {
//         id: 2,
//         name: "Jane Doe",
//         avatar: "/images/default_img.png",
//       },
//     ],
//     totalPeople: 40,
//   },
//   {
//     id: 4,
//     topic: "Why people use stack overflow?",
//     speakers: [
//       {
//         id: 1,
//         name: "John Doe",
//         avatar: "/images/default_img.png",
//       },
//       {
//         id: 2,
//         name: "Jane Doe",
//         avatar: "/images/default_img.png",
//       },
//     ],
//     totalPeople: 40,
//   },
//   {
//     id: 5,
//     topic: "Artificial inteligence is the future?",
//     speakers: [
//       {
//         id: 1,
//         name: "John Doe",
//         avatar: "/images/default_img.png",
//       },
//       {
//         id: 2,
//         name: "Jane Doe",
//         avatar: "/images/default_img.png",
//       },
//     ],
//     totalPeople: 40,
//   },
// ];

const Rooms = () => {
  const [showModal, setShowModal] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(16);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const lastRoom = useRef(null);
  const { ref, entry } = useIntersection({
    root: lastRoom.current,
    threshold: 1,
  });

  const filteredRooms = rooms.filter((room) =>
    room.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const fetchRooms = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await getAllRooms({ skip, limit, types: ["Public"] });
      setSkip((skip) => skip + limit);
      setRooms((prevItems) => [...prevItems, ...data]);
      console.log("skip", skip, limit);
    } catch (err) {
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
    // setRooms(data);
  };
  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    console.log("entry", skip, filteredRooms.length);
    if (entry && entry?.isIntersecting && skip <= filteredRooms.length)
      fetchRooms();
  }, [entry]);

  // const handleScroll = () => {
  //   const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

  //   if (scrollTop + clientHeight >= scrollHeight - 100 && !loading) {
  //     console.log("yes");
  //     setSkip((prevSkip) => prevSkip + limit);
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  const isEndOfPage = skip >= filteredRooms.length;

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  function openModal() {
    setShowModal(true);
  }
  return (
    <>
      <div className="container">
        <div className={styles.roomHeader}>
          <div className={styles.left}>
            <span className={styles.heading}>All voice rooms</span>
            <div className={styles.searchBox}>
              <img src="./images/search.png" alt="search" />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className={styles.right}>
            <button onClick={openModal} className={styles.startRoomButton}>
              <img src="./images/add-room.png" alt="add room" />
              <span>Start Room</span>
            </button>
          </div>
        </div>
        <div className={styles.listWrap}>
          <div className={styles.roomList}>
            {filteredRooms.map((room, index) => {
              if (index === filteredRooms.length - 1) {
                return (
                  <div ref={ref} key={room.id}>
                    <RoomCard room={room} />
                  </div>
                );
              } else {
                return <RoomCard key={room.id} room={room} />;
              }
            })}
          </div>
        </div>
      </div>
      {showModal && <AddRoomModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default Rooms;
