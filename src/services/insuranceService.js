//insuranceService.js 
import InsuranceOrder from "../models/InsuranceOrder"

export const getInsuranceOrders = async (filters) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const url = "https://aut.bshc.com.vn/api/vehicle-uw/get-list-contract";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${user?.token}`
      },
      body: JSON.stringify({
        FromDate: filters.fromDate,
        ToDate: filters.toDate,
        Channel: filters.channel || "MISA",
        NameCustomer: filters.customer || "",
        LicensePlate: filters.vehicle || "",
        HandlingStatus: filters.handlingStatus || "",
        Result: filters.result || "",
        OrderStatus: filters.orderStatus || "",
      }),
    }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.Status !== "OK") {
      throw new Error(`API returned error: ${data.ErrCode} - ${data.Message}`)
    }

    return data.Data.map((item) => new InsuranceOrder(item))
  } catch (error) {
    console.error("Failed to fetch insurance orders:", error)
    return []
  }
}


export const getSearchBoxData = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const url = `https://aut.bshc.com.vn/api/vehicle-uw/init?Channel=MISA&ProductCode=XE`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${user?.token}`
      },
    });

    const data = await res.json();
    return data;

  } catch (err) {
    console.error("API Error:", err);
  }
};

