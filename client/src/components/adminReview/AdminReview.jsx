import styles from "./AdminReview.module.css";
import React, { useState } from "react";
import ReviewDelModal from "../modals/ReviewDelModal";

const AdminReview = ({ el }) => {
  const [deleteModal, setDeleteModal] = useState(false);

  const imgurl = el.user.profile_img
    ? el.user.profile_img
    : "../../../images/profile.jpeg";

  const clickDelete = () => {
    setDeleteModal(true);
  };

  const createdDay = el.createdAt.split("T")[0];
  //console.log(el);
  return (
    <section className={styles.container}>
      <div className={styles.box}>
        <div className={styles.upDateBox}>
          <div className={styles.exBox}>
            <div className={styles.thumBox}>
              <img src={imgurl} alt={imgurl} className={styles.eximg} />
            </div>

            <div className={styles.title}>{el.exhibition.title}</div>
            <div className={styles.user}>{el.user.nickname}</div>
            <div className={styles.comments}>{el.comments}</div>
            <div className={styles.commentsDay}>{createdDay} </div>
          </div>

          <div className={styles.btnBox}>
            <button className={styles.btn} onClick={clickDelete}>
              삭제하기
            </button>
          </div>
          {deleteModal ? (
            <ReviewDelModal el={el} setDeleteModal={setDeleteModal} />
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default AdminReview;
