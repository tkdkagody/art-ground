import axios from "axios";

export function getAllExhibition(
  setExhibitData,
  exFilter,
  startDateNum,
  endDateNum
) {
  return axios
    .get(`${process.env.REACT_APP_DEPOLOY_SERVER_URI}/exhibition`)
    .then((result) => {
      if (exFilter === "") {
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
          return el.title.toLowerCase().includes(exFilter.toLowerCase());
        });
        res = res.concat(
          result.data.data.filter((el) => {
            return el.author.nickname
              .toLowerCase()
              .includes(exFilter.toLowerCase());
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

//일반 리뷰데이터
export function getAllReviews(setReviewData) {
  return axios
    .get(`${process.env.REACT_APP_DEPOLOY_SERVER_URI}/admin/review`)
    .then((result) => {
      setReviewData(result.data.data);
    })
    .catch((err) => console.log(err));
}

export async function getinfiniteData(revFilter) {
  try {
    const result = await axios.get(
      `${process.env.REACT_APP_DEPOLOY_SERVER_URI}/admin/review`
    );
    if (revFilter === "") {
      return result.data.data;
    } else {
      let res = result.data.data.filter((el) => {
        console.log(el.exhibition);
        return el.exhibition.title
          .toLowerCase()
          .includes(revFilter.toLowerCase());
      });
      res = res.concat(
        result.data.data.filter((el) => {
          return el.comments.toLowerCase().includes(revFilter.toLowerCase());
        })
      );
      res = res.concat(
        result.data.data.filter((el) => {
          return el.user.nickname
            .toLowerCase()
            .includes(revFilter.toLowerCase());
        })
      );
      return res;
    }
  } catch (err) {
    return console.log(err);
  }
}

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
