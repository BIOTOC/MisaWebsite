// services/insuranceDetailService.js
import InsuranceDetail from "../models/InsuranceDetail";
import AuditHistory from "../models/AuditHistory";

export const getInsuranceDetail = async (id) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const unit = "000";
    const url = `https://aut.bshc.com.vn/api/vehicle-uw/get-detail-contract?unit=${unit}&id=${id}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${user.token}`
      }
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const apiData = await res.json();

    if (apiData.Status !== "OK") throw new Error(apiData.Message);

    const data = {
      ...apiData.Data,
      vehicles: apiData.Data.vehicleInfo
    };

    return new InsuranceDetail(data);

  } catch (err) {
    console.error("Lỗi khi gọi getInsuranceDetail:", err);
    return null;
  }
};

export const getHistoryData = async (id, iddt) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const url = `https://aut.bshc.com.vn/api/vehicle-uw/get-history?id=${id}&id_dt=${iddt}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${user?.token}`
      },
    });

    const api = await res.json();

    if (api.Status !== "OK") {
      return { auditHistory: [] };
    }

    const list = api.Data ?? [];

    //  const sorted = list.sort(
    //   (a, b) => new Date(a.date) - new Date(b.date)
    // );

    const auditHistory = list.map((item) => new AuditHistory(item));

    return { auditHistory };

  } catch (err) {
    console.error("API Error:", err);
    return { auditHistory: [] };
  }
};

// export const createVehicleUW = async (id, orderStatus, handlingStatus, iddt, result, description,) => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const url = "https://aut.bshc.com.vn/api/vehicle-uw/create";

//   const payload = {
//     unit: "000",
//     id: id,
//     reviewerCode: user.staffCode,
//     orderStatus: orderStatus,
//     handlingStatus: handlingStatus,
//     uwList: [
//       {
//         id_dt: iddt,
//         result: result,
//         description: description
//       }
//     ]
//   };

//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Accept": "application/json",
//         Authorization: `Bearer ${user?.token}`

//       },
//       body: JSON.stringify(payload)
//     });

//     const data = await response.json();
//     return data;

//   } catch (error) {
//     console.error("Error calling API:", error);
//     throw error;
//   }
// };

export const createVehicleUW = async (payload) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const url = "https://aut.bshc.com.vn/api/vehicle-uw/create";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({
        ...payload,
        reviewerCode: user.staffCode
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error("Error calling API createVehicleUW:", error);
    throw error;
  }
};


export const pushToPartner = async (channel, productCode, id, orderStatus, handlingStatus, iddt, result, description) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const payload = {
      channel: channel,
      unit: user.unitCode,
      productCode: productCode,
      id: id,
      reviewerCode: user.staffCode,
      orderStatus: orderStatus,
      handlingStatus: handlingStatus,
      uwList: [
        {
          id_dt: iddt,
          result: result,
          description: description
        }
      ]
    };

    const response = await fetch(
      "https://aut.bshc.com.vn/api/vehicle-uw/push-to-partner",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API response:", data);
    return data;
  } catch (error) {
    console.error("Error calling push-to-partner:", error);
    return null;
  }
};