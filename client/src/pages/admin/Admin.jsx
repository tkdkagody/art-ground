import styles from "./Admin.module.css";
import ScrollButton from "../../components/scrollButton/ScrollButton";
import React, { useCallback, useEffect, useState } from "react";
import AdminEx from "../../components/adminEx/AdminEx";
import AdminReview from "../../components/adminReview/AdminReview";
import Loading from "../../components/loading/Loading";
import { getAllExhibition, getinfiniteData } from "../../api/adminApi";
import useHistoryState from "../../utils/useHistoryState";
import { useHistory } from "react-router";
import { ko } from "date-fns/esm/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Admin = ({ isLogin, userinfo, handleLogout }) => {
  const history = useHistory();
  const [exhibition, setExhibition] = useState(true); //대분류 페이지
  const [review, setReview] = useState(false);
  const [updateEx, setUpdateEx] = useState(true); //ex소분류 페이지이동
  const [deleteEx, setDeleteEx] = useState(false);
  const [doneEx, setDoneEx] = useState(false);
  const [adExRender, setAdExRender] = useState(false); //새로고침시 랜더되도록
  const [exhibitData, setExhibitData] = useState([]); //데이터 상태값
  const [reviewData, setReviewData] = useState([]);
  const [restData, setRestData] = useState([]); // 랜더 하고 남은 데이터
  const [isLoading, setIsLoading] = useState(true);
  const clickExColor = !exhibition ? styles.libox : styles.liboxClick; //대메뉴 css
  const clickRevColor = !review ? styles.libox : styles.liboxClick;
  const clickEXSmenu1 = !updateEx ? styles.btn : styles.btnClick; //ex소메뉴 css
  const clickEXSmenu2 = !deleteEx ? styles.btn : styles.btnClick;
  const clickEXSmenu3 = !doneEx ? styles.btn : styles.btnClick;
  const [filter, setfilter] = useHistoryState("", "filter"); //검색하기 컨트롤
  const [enteredWord, setEnteredWord] = useHistoryState("", "enteredWord");
  //datepicker //createdAt: "2021-10-06T14:43:35.000Z"
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startDateNum, setStartDateNum] = useState();
  const [endDateNum, setEndDateNum] = useState();

  const clickStartDate = (date) => {
    setStartDate(date);
    setStartDateNum(getDay(date));
  };
  const clickEndDate = (date) => {
    setEndDate(date);
    setEndDateNum(getDay(date));
  };

  const getDay = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    setTimeout(() => {
      setAdExRender(true);
    }, 500);
  }, []);

  const handleChange = (event) => {
    setEnteredWord(event.target.value);
  };
  const clickSearch = () => {
    setfilter(enteredWord);
  };
  const handleInputClear = () => {
    setEnteredWord("");
    setfilter("");
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      clickSearch();
    }
  };

  useEffect(() => {
    if (exhibition) {
      getAllExhibition(setExhibitData, filter, startDateNum, endDateNum);
    }
    return () => {};
  }, [exhibition, filter, startDateNum, endDateNum]);

  const clickEx = () => {
    setExhibition(true);
    setReview(false);
  };
  const clickReview = () => {
    setExhibition(false);
    setReview(true);
  };

  const clickUpdate = () => {
    setUpdateEx(true);
    setDeleteEx(false);
    setDoneEx(false);
  };
  const clickDelete = () => {
    setUpdateEx(false);
    setDeleteEx(true);
    setDoneEx(false);
  };
  const clickDoneEx = () => {
    setUpdateEx(false);
    setDeleteEx(false);
    setDoneEx(true);
  };

  const fetchMoreData = async () => {
    if (restData.length !== 0) {
      setIsLoading(true);
      setTimeout(() => {
        setReviewData(reviewData.concat(restData.slice(0, 10)));
        setRestData(restData.slice(10));
        setIsLoading(false);
      }, 500);
    }
  };

  const _infiniteScroll = useCallback(() => {
    let scrollHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    let scrollTop = Math.max(
      document.documentElement.scrollTop,
      document.body.scrollTop
    );
    let clientHeight = document.documentElement.clientHeight;
    scrollHeight -= 100;
    if (scrollTop + clientHeight >= scrollHeight && isLoading === false) {
      fetchMoreData();
    }
  }, [isLoading]);

  const getFetchData = async () => {
    setIsLoading(true);
    let data = await getinfiniteData();
    setReviewData(data.slice(0, 10));
    setRestData(data.slice(10));
    setIsLoading(false);
  };

  useEffect(() => {
    setTimeout(() => {
      getFetchData();
    }, 200);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", _infiniteScroll, true);
    return () => window.removeEventListener("scroll", _infiniteScroll, true);
  }, [_infiniteScroll]);

  return (
    <section className={styles.container}>
      <ScrollButton />
      <div className={styles.nav}>
        <div className={styles.top}>
          <span className={styles.logoborder}>ADMINISTRATION</span>
          <ul className={styles.title}>
            <li className={`${clickExColor}`} onClick={clickEx}>
              전시관리
            </li>
            <li className={`${clickRevColor}`} onClick={clickReview}>
              리뷰관리
            </li>
          </ul>
        </div>
        <div className={styles.bottom}>
          <div className={styles.categoryBox}>
            {adExRender ? (
              <div className={styles.greeting}>
                <span>{userinfo.user_email.split("@")[0]} </span>
                <span> 님 환영합니다!</span>
                {isLogin ? (
                  <span
                    onClick={() => {
                      history.push("/about");
                      handleLogout();
                    }}
                  >
                    [로그아웃]
                  </span>
                ) : (
                  <span>[로그인]</span>
                )}
              </div>
            ) : (
              <Loading />
            )}
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {exhibition ? (
          <div className={styles.exhibit}>
            {adExRender ? (
              <>
                <div className={styles.btnbox}>
                  <button className={clickEXSmenu1} onClick={clickUpdate}>
                    승인대기
                  </button>
                  <button className={clickEXSmenu2} onClick={clickDelete}>
                    마감대기
                  </button>
                  <button className={clickEXSmenu3} onClick={clickDoneEx}>
                    마감된 전시회
                  </button>
                </div>
                <div className={styles.searchBox}>
                  <div className={styles.searchBorder}>
                    <input
                      type="text"
                      className={styles.searchTxt}
                      placeholder="전시명 또는 작가명으로 검색하세요."
                      value={enteredWord}
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                    />
                    {filter.length !== 0 ? (
                      <button
                        className={styles.deleteImg}
                        onClick={handleInputClear}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    ) : null}
                    <button className={styles.searchImg} onClick={clickSearch}>
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </div>

                {filter !== "" && exhibitData.length === 0 ? (
                  <div className={styles.searchRes}>검색 결과가 없습니다.</div>
                ) : filter !== "" && exhibitData.length !== 0 ? (
                  <div className={styles.searchRes}>
                    "{filter}" 검색결과 총 {exhibitData.length}
                    건이 검색되었습니다.
                  </div>
                ) : null}

                <div className={styles.qasearchline}>
                  <ul className={styles.termBtn}>
                    <li>신청일로 조회</li>

                    <label className={styles.dateBtn}>
                      <div>
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => clickStartDate(date)}
                          startDate={startDate}
                          locale={ko}
                          dateFormat="yyyy-MM-dd"
                          className={styles.startDate}
                        />
                      </div>
                      ~
                      <div>
                        <DatePicker
                          selected={endDate}
                          onChange={(date) => clickEndDate(date)}
                          endDate={endDate}
                          locale={ko}
                          dateFormat="yyyy-MM-dd"
                          className={styles.endDate}
                        />
                      </div>
                    </label>
                    {/* <button
                      className={styles.dateSearch}
                      onClick={clickDateSearch}
                    >
                      조회
                    </button> */}
                  </ul>
                </div>

                {exhibitData.map((el, idx) => {
                  return (
                    <AdminEx
                      key={idx}
                      el={el}
                      updateEx={updateEx}
                      deleteEx={deleteEx}
                      doneEx={doneEx}
                      enteredWord={enteredWord}
                    />
                  );
                })}
              </>
            ) : (
              <Loading />
            )}
          </div>
        ) : null}
        {review ? (
          <div className={styles.exhibit}>
            {adExRender ? (
              <>
                <div className={styles.btnbox}>
                  <button className={clickEXSmenu3}>전체보기</button>
                </div>
                {reviewData.map((el, idx) => {
                  return <AdminReview key={idx} el={el} />;
                })}
              </>
            ) : (
              <Loading />
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Admin;
