import axios from "axios";

export function getAllExhibition(
  setExhibitData,
  filter,
  startDateNum,
  endDateNum
) {
  return axios
    .get(`${process.env.REACT_APP_DEPOLOY_SERVER_URI}/exhibition`)
    .then((result) => {
      if (filter === "") {
        let foundDay = result.data.data;
        if (startDateNum && !endDateNum) {
          foundDay = result.data.data.filter((el) => {
            return el.createdAt.split("T")[0] > startDateNum;
          });
        } else if (startDateNum && endDateNum) {
          foundDay = result.data.data.filter((el) => {
            return (
              el.createdAt.split("T")[0] >= startDateNum &&
              el.createdAt.split("T")[0] <= endDateNum
            );
          });
        }
        setExhibitData(foundDay);
      } else {
        let res = result.data.data.filter((el) => {
          return el.title.toLowerCase().includes(filter.toLowerCase());
        });
        res = res.concat(
          result.data.data.filter((el) => {
            return el.author.nickname
              .toLowerCase()
              .includes(filter.toLowerCase());
          })
        );

        setExhibitData(res);
      }
    })
    .catch((err) => console.log(err));
}

export function confirmExhibition(setConfirmModal, el) {
  return axios
    .post(`${process.env.REACT_APP_DEPOLOY_SERVER_URI}/admin/exhibition`, {
      data: el,
    })
    .then((result) => {
      setConfirmModal(false);
      window.location.href = "https://art-ground.io/admin";
    })
    .catch((err) => console.log(err));
}

export function deleteExhibition(setConfirmModal, el) {
  return axios
    .delete(
      `${process.env.REACT_APP_DEPOLOY_SERVER_URI}/admin/exhibition/${el.id}/${el.exhibit_type}`
    )
    .then((result) => {
      setConfirmModal(false);
      window.location.href = "https://art-ground.io/admin";
    })
    .catch((err) => console.log(err));
}

export function getAllReviews(setReviewData) {
  return axios
    .get(`${process.env.REACT_APP_DEPOLOY_SERVER_URI}/admin/review`)
    .then((result) => {
      setReviewData(result.data.data);
    })
    .catch((err) => console.log(err));
}

export async function getinfiniteData() {
  try {
    const result = await axios.get(
      `${process.env.REACT_APP_DEPOLOY_SERVER_URI}/admin/review`
    );
    return result.data.data;
  } catch (err) {
    return console.log(err);
  }
}

//리뷰삭제
export function deleteReviews(setDeleteModal, el) {
  return axios
    .delete(
      `${process.env.REACT_APP_DEPOLOY_SERVER_URI}/admin/review/${el.exhibition_id}/${el.id}`
    )
    .then((result) => {
      if (result.data.message === "successfully delete comments") {
        setDeleteModal(false);
        window.location.href = "https://art-ground.io/admin";
      }
    })
    .catch((err) => console.log(err));
}
