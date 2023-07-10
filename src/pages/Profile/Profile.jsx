import React, { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import Balancer from "react-wrap-balancer";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUser, followUser, unfollowUser, changeBio } from "../../http";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const { id: userId } = useParams();
  const [profile, setProfile] = useState();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await getUser({ userId });
      setProfile(data.user);
    };
    fetchUser();
  }, [user, userId]);

  useEffect(() => {
    setIsFollowing(profile?.followers?.includes(user.id));
  }, [profile?.followers, user.id]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(userId);
        setProfile((prevProfile) => ({
          ...prevProfile,
          followers: prevProfile.followers.filter((id) => id !== user.id),
        }));
      } else {
        await followUser(userId);
        setProfile((prevProfile) => ({
          ...prevProfile,
          followers: [...prevProfile.followers, user.id],
        }));
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      // Handle the error, e.g., display an error message to the user.
    }
  };

  const handleDescriptionChange = () => {
    setIsEditingDescription(true);
    setNewDescription(profile?.bio);
  };

  const handleSaveDescription = async () => {
    // Perform save description logic here, e.g., make an API call
    await changeBio({ desc: newDescription });
    // After successfully saving the description, update the profile state
    setProfile((prevProfile) => ({
      ...prevProfile,
      bio: newDescription,
    }));
    setIsEditingDescription(false);
  };

  return (
    <>
      <div className="container">
        <div className={styles.roomHeader}>
          <div className={styles.left}>
            <span className={styles.heading}>Profile</span>
          </div>
        </div>
        {profile && (
          <div className={styles.details}>
            <div className={styles.left}>
              <div className={styles.userbox}>
                <div className={styles.avatar}>
                  <img src={profile?.avatar} alt="avatar" />
                </div>
                <span className={styles.name}>{profile?.name}</span>
                <div className={styles.service}>
                  {profile?.id === user.id ? (
                    <>
                      {isEditingDescription ? (
                        <>
                          {/* <input
                            type="text"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                          /> */}
                          <button
                            onClick={handleSaveDescription}
                            className={styles.saveDescriptionButton}
                          >
                            Save Description
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleDescriptionChange}
                          className={styles.changeDescriptionButton}
                        >
                          Change Description
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {isFollowing ? (
                        <button
                          onClick={handleFollow}
                          className={styles.unfollowButton}
                        >
                          Unfollow
                        </button>
                      ) : (
                        <button
                          onClick={handleFollow}
                          className={styles.followButton}
                        >
                          Follow
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className={styles.description}>
                <Balancer>
                  {isEditingDescription ? (
                    <textarea
                      type="textarea"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                    />
                  ) : (
                    <pre>{profile?.bio}</pre>
                  )}
                </Balancer>
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.content}>
                <h2>{profile?.followers?.length || 0}</h2>
                <p>Followers</p>
              </div>
              <div className={styles.content}>
                <h2>{profile?.following?.length || 0}</h2>
                <p>Following</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
