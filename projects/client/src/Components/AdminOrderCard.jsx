import { Receipt, ReceiptLong } from "@mui/icons-material";
import { Box, Card, Divider, Grid, IconButton } from "@mui/material";
import axios from "axios";
import { API_IMAGE_URL } from "../helper";
import Button from "./atoms/Button";
import Text from "./atoms/Text";

const AdminOrderCard = (props) => {
  const { orderData, handleOpenModal, handleShowReceipt } = props;
  const { status } = orderData;
  let statusColor = "";

  switch (orderData.status) {
    case "Waiting for Prescription Validation":
    case "Waiting for Payment":
    case "Waiting for Confirmation":
    case "Cancelled":
      statusColor = "error";
      break;
    case "Processed":
    case "Sent":
      statusColor = "secondary";
      break;
    case "Completed":
      statusColor = "primary";
      break;
    default:
      statusColor = "black";
  }

  const handleProcessOrder = (action) => {
    let text = "";
    let type = "";
    let new_status = "";
    if (action === "cancel") {
      type = "warning";
      if (status === "Waiting for Confirmation") {
        text = "Are you sure you want to reject this payment?";
        new_status = "Waiting for Payment";
      } else if (status === "Processed") {
        text = "Are you sure you want to cancel this order?";
        new_status = "Cancelled";
      }
    } else if (action === "process") {
      type = "confirm";
      if (status === "Waiting for Confirmation") {
        text = "Are you sure you want to confirm this payment?";
        new_status = "Processed";
      } else if (status === "Processed") {
        text = "Are you sure you want to send this order?";
        new_status = "Sent";
      }
    }
    handleOpenModal(orderData.id, text, type, new_status);
  };

  return (
    <>
      <Card>
        <Grid
          container
          sx={{
            px: 2,
            py: 1,
            backgroundColor: "#f7fbfc",
            alignItems: "center",
          }}
        >
          <Grid
            item
            xs={12}
            md={8}
            sx={{ alignItems: "center", order: { xs: 2, md: 1 } }}
          >
            <Box>
              <Text fontSize="subtitle2">
                Invoice Number : {orderData.invoice_number}
              </Text>
              <Text fontSize="subtitle2">
                Order Date : {orderData.created_at.substring(0, 10)}
              </Text>
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ order: { xs: 1, md: 2 } }}>
            <Box>
              <Text
                textAlign="right"
                fontWeight="medium"
                fontSize="subtitle2"
                color={statusColor}
                sx={{ py: 1 }}
              >
                {status}
              </Text>
            </Box>
          </Grid>
        </Grid>
        <Divider />
        <Box sx={{ mx: 2, my: 1 }}>
          {orderData.content.map((value, index) => {
            return (
              <Grid container alignItems="center" key={index}>
                <Grid item xs={4} sm={2}>
                  <Box
                    display="flex"
                    sx={{
                      height: "85px",
                      alignItems: "center",
                      mx: 1,
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={`${API_IMAGE_URL}${value.product_image}`}
                      style={{ width: "85px", maxWidth: "100%" }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={8} sm={8}>
                  <Text fontWeight="bold" fontSize="subtitle1">
                    {value.product_name}
                  </Text>
                  <Text>
                    {!value.hasOwnProperty("ingredients") ? (
                      <>
                        x {value.quantity} {value.unit}
                      </>
                    ) : (
                      <>
                        Ingredients:{" "}
                        {value.ingredients.map(
                          (ingredientsValue, ingredientsIndex) => {
                            return (
                              <span key={`ingredient-${ingredientsIndex}`}>
                                {ingredientsValue.product_name}
                                {ingredientsIndex <
                                  value.ingredients.length - 1 && `, `}
                              </span>
                            );
                          }
                        )}
                      </>
                    )}
                  </Text>
                  <Text sx={{ display: { xs: "block", sm: "none" } }}>
                    IDR
                    {!value.hasOwnProperty("ingredients") ? (
                      <>
                        {(
                          value.quantity * value.selling_price
                        ).toLocaleString()}
                      </>
                    ) : (
                      <>{value.subtotal_selling_price.toLocaleString()}</>
                    )}
                  </Text>
                </Grid>
                <Grid item xs={2} sx={{ display: { xs: "none", sm: "block" } }}>
                  <Text textAlign="right" fontSize="subtitle2">
                    IDR
                    {!value.hasOwnProperty("ingredients") ? (
                      <>
                        {(
                          value.quantity * value.selling_price
                        ).toLocaleString()}
                      </>
                    ) : (
                      <>{value.subtotal_selling_price.toLocaleString()}</>
                    )}
                  </Text>
                </Grid>
              </Grid>
            );
          })}
        </Box>
        <Divider />
        <Grid
          container
          sx={{ p: 2, alignItems: "center", backgroundColor: "#f7fbfc" }}
        >
          <Grid
            item
            xs={12}
            sm={9}
            sx={{
              pt: { xs: 1, sm: 0 },
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              order: { xs: 2, sm: 1 }
            }}
          >
            {(status === "Waiting for Confirmation" ||
              status === "Processed") && (
                <>
                  <Box sx={{ mr: 1 }}>
                    <Button
                      variant="text"
                      color="error"
                      size="small"
                      onClick={() => handleProcessOrder("cancel")}
                    >
                      {status === "Waiting for Confirmation" ? (
                        <>Reject Payment</>
                      ) : status === "Processed" ? (
                        <>Cancel Order</>
                      ) : null}
                    </Button>
                  </Box>

                  <Box sx={{ mr: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      width="130px"
                      onClick={() => handleProcessOrder("process")}
                    >
                      {status === "Waiting for Confirmation" ? (
                        <>Confirm Payment</>
                      ) : status === "Processed" ? (
                        <>Send Order</>
                      ) : null}
                    </Button>
                    {status === "Waiting for Confirmation" ?
                      <IconButton onClick={() => handleShowReceipt(orderData.payment_slip_image)}>
                        <ReceiptLong />
                      </IconButton>
                      : null}
                  </Box>
                </>
              )}
          </Grid>
          <Grid item xs={12} sm={3} sx={{ order: { xs: 1, sm: 2 } }}>
            <Box sx={{ minWidth: "100px" }}>
              <Text textAlign="right" fontWeight="bold">
                IDR{orderData.subtotal.toLocaleString()}
              </Text>
            </Box>
          </Grid>
        </Grid>
        {/* <Box
          sx={{
            mx: 2,
            my: 2,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {(status === "Waiting for Confirmation" ||
            status === "Processed") && (
            <>
              <Box sx={{ mr: 1 }}>
                <Button
                  variant="text"
                  color="error"
                  size="small"
                  onClick={handleCancelOrder}
                >
                  Cancel Order
                </Button>
              </Box>
              <Box sx={{ mr: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleConfirmOrder}
                >
                  {status === "Waiting for Confirmation" ? (
                    <>Confirm Payment</>
                  ) : status === "Processed" ? (
                    <>Send Order</>
                  ) : null}
                </Button>
              </Box>
            </>
          )}
          <Box sx={{ minWidth: "100px" }}>
            <Text textAlign="right">
              IDR{orderData.subtotal.toLocaleString()}
            </Text>
          </Box>
        </Box> */}
      </Card>
    </>
  );
};

export default AdminOrderCard;
