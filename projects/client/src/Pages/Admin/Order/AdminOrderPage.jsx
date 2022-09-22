import { Box, Container, Divider, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../helper";
import OrderFilter from "./partials/OrderFilter";
import OrderSidebar from "./partials/OrderSidebar";
import OrderList from "./partials/OrderList";
import { useSelector } from "react-redux";

const AdminOrderPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [orderData, setOrderData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortBy, setSortBy] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState("");
  const [limit, setLimit] = useState(5);

  const { token } = useSelector((state) => {
    return { token: state.userReducer.token };
  });

  const convertDateToString = (fullDate) => {
    const year = `${fullDate.$y}`;
    const month = `0${1 + fullDate.$M}`.slice(-2);
    const date = `0${fullDate.$D}`.slice(-2);
    return `${year}-${month}-${date}`;
  };

  const getOrderData = async (
    filterInvoice = invoiceNumber,
    filterStartDate = startDate,
    filterEndDate = endDate,
    filterStatus = selectedStatus,
    querySort = sortBy,
    queryPage = currentPage,
    queryLimit = limit
  ) => {
    try {
      if (startDate !== null && typeof filterStartDate === "object") {
        filterStartDate = convertDateToString(filterStartDate);
      }
      if (endDate !== null && typeof filterEndDate === "object") {
        filterEndDate = convertDateToString(filterEndDate.add(1,"day"));
      }

      let query = "";
      if (filterStatus) {
        if (query) {
          query += `&status=${filterStatus}`;
        } else {
          query += `?status=${filterStatus}`;
        }
      }
      if (filterInvoice) {
        if (query) {
          query += `&invoice_number=${filterInvoice}`;
        } else {
          query += `?invoice_number=${filterInvoice}`;
        }
      }
      if (filterStartDate) {
        if (query) {
          query += `&start_date=${filterStartDate}`;
        } else {
          query += `?start_date=${filterStartDate}`;
        }
      }
      if (filterEndDate) {
        if (query) {
          query += `&end_date=${filterEndDate}`;
        } else {
          query += `?end_date=${filterEndDate}`;
        }
      }
      if (querySort) {
        if (query) {
          query += `&${querySort}`;
        } else {
          query += `?${querySort}`;
        }
      }
      if (queryPage) {
        if (query) {
          query += `&page=${queryPage}`;
        } else {
          query += `?page=${queryPage}`;
        }
      }

      if (queryLimit) {
        if (query) {
          query += `&limit=${queryLimit}`;
        } else {
          query += `?limit=${queryLimit}`;
        }
      }

      const res = await axios.get(`${API_URL}/admin/order${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        setOrderData(res.data.data);
        setTotalPage(res.data.totalPage);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrderData();
  }, []);

  useEffect(() => {
    getOrderData();
  }, [selectedStatus, sortBy, currentPage, limit]);

  return (
    <div>
      <Container>
        {!isLoading && (
          <Grid container>
            <Grid item xs={12} md={3} sx={{ p: 1 }}>
              <OrderSidebar
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                setSelectedStatus={setSelectedStatus}
                setCurrentPage={setCurrentPage}
              />
            </Grid>
            <Divider sx={{ display: { xs: "flex", md: "none" } }} />
            <Grid item xs={12} md={9} sx={{ pt: 2 }}>
              <Divider />
              <Box>
                <OrderFilter
                  invoiceNumber={invoiceNumber}
                  setInvoiceNumber={setInvoiceNumber}
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                  getOrderData={getOrderData}
                  setCurrentPage={setCurrentPage}
                />
              </Box>
              <Divider />
              <Box>
                <OrderList
                  orderData={orderData}
                  getOrderData={getOrderData}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPage={totalPage}
                  limit={limit}
                  setLimit={setLimit}
                />
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default AdminOrderPage;
