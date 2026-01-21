import Propertyforsale from "../models/Propertyforsale.models.js";


// export const savePropertyRequest = async (req, res) => {
//   try {
//     // Parse the JSON string from the FormData 'payload' field
//     const data = JSON.parse(req.body.payload);

//     // Map uploaded files from Multer
//     const fileData = req.files ? req.files.map(file => ({
//       fileName: file.originalname,
//       path: file.path,
//       mimetype: file.mimetype
//     })) : [];

//     const newRequest = new Propertyforsale({
//       propertyStatus: data.propertyStatus,
//       propertyType: data.propertyType,
//       location: data.location,
//       developer: data.developer,
//       area: data.area,
//       rooms: data.rooms,
//       bathrooms: data.bathrooms,
//       propertyAge: data.propertyAge,
//       priceLimit: data.priceLimit,
//       priceOffer: data.priceOffer,
//       isNegotiable: data.isNegotiable,
//       notes: data.notes,
//       clientName: data.clientName,
//       clientMobile: data.clientMobile,
//       contactChannels: data.contactChannels,
//       files: fileData
//     });

//     await newRequest.save();

//     res.status(201).json({
//       success: true,
//       message: "تم حفظ البيانات بنجاح",
//       data: newRequest
//     });
//   } catch (error) {
//     console.error("Save Error:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };


export const savePropertyRequest = async (req, res) => {
  try {
    // Parsing the 'payload' string sent from React FormData
    const data = JSON.parse(req.body.payload);
    
    // Mapping the files saved by Multer
    const fileEntries = req.files.map(file => ({
      fileName: file.originalname,
      filePath: file.path,
      fileType: file.mimetype
    }));

    const newProperty = new Propertyforsale({
      ...data,
      files: fileEntries
    });

    await newProperty.save();
    res.status(201).json({ success: true, message: "Request saved successfully!" });
  } catch (error) {
    console.error("Save Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. VIEW ALL: Get all requests
export const getAllServiceRequests = async (req, res) => {
  try {
    const requests = await Propertyforsale.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: "خطأ في جلب البيانات", error: error.message });
  }
};

// 3. SINGLE VIEW: Get one request by ID
export const getServiceRequestById = async (req, res) => {
  try {
    const request = await Propertyforsale.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: "الطلب غير موجود" });
    }
    res.status(200).json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: "خطأ في خادم البيانات", error: error.message });
  }
};

// 4. UPDATE: Update a request by ID
export const updateServiceRequest = async (req, res) => {
  try {
    const updatedRequest = await Propertyforsale.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: "الطلب غير موجود" });
    }

    res.status(200).json({ success: true, message: "تم تحديث البيانات بنجاح", data: updatedRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: "خطأ في التحديث", error: error.message });
  }
};

// 5. DELETE: Remove a request by ID
export const deleteServiceRequest = async (req, res) => {
  try {
    const deletedRequest = await Propertyforsale.findByIdAndDelete(req.params.id);
    if (!deletedRequest) {
      return res.status(404).json({ success: false, message: "الطلب غير موجود" });
    }
    res.status(200).json({ success: true, message: "تم حذف الطلب بنجاح" });
  } catch (error) {
    res.status(500).json({ success: false, message: "خطأ في الحذف", error: error.message });
  }
};