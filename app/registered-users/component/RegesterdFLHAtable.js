import { db } from "@/lib/firebase/firebaseInit";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { DateTimeUtility } from "@/lib/utils/DateTimeUtility";
import Image from "next/image";

const RegesterdFLHATable = ({
  currentCompanyName,
  admin,
  sortBy = "name",
  sortDirection = "asc",
}) => {
  const [items, setItems] = useState([]);
  const [selectedData, setSelectedData] = useState([]);

  const sortData = (data) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      if (sortBy === "name") {
        return sortDirection === "asc"
          ? a.user_name.localeCompare(b.user_name)
          : b.user_name.localeCompare(a.user_name);
      } else if (sortBy === "date") {
        const dateA = new Date(a.data.date);
        const dateB = new Date(b.data.date);
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });
    return sortedData;
  };

  const fetchImageAsBase64 = async (url) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`Failed to fetch image: ${response.statusText}`);
        return null;
      }

      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error(`Error fetching image: ${error.message}`);
      return null;
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "FLHA"));
        const flhaData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        const updatedData = await Promise.all(
          flhaData.map(async (item) => {
            if (item.data.signature_url) {
              const base64Signature = await fetchImageAsBase64(
                item.data.signature_url
              );
              return { ...item, signature_base64: base64Signature };
            }
            return item;
          })
        );

        let updatedSelectedData = updatedData;
        if (!admin && currentCompanyName) {
          updatedSelectedData = updatedData.filter(
            (item) => item.company_name === currentCompanyName
          );
        }

        // Sort the data
        updatedSelectedData = sortData(updatedSelectedData);

        setItems(updatedData);
        setSelectedData(updatedSelectedData);
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchItems();
  }, [admin, currentCompanyName, sortBy, sortDirection]);

  return (
    <div className="overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">User FLHA Information</h2>
      <table className="min-w-full divide-y divide-gray-200 border border-gray-100">
        <thead className="bg-yellow-100 w-full">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Company Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              PPE Inspected
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              To Do Work
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Site Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Submitted Date and Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Environmental Hazards (Flhf)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ergonomics Hazards
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Access/Egress Hazards
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Overhead/Underground Hazards
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Equipment/Vac Truck Hazards
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Personal Limitations Hazards
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              All Hazard Remaining
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              All Permits Closed Out
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Any Incident
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Area Cleaned Up At End
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Master Point Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Signature
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {selectedData.map((flha, index) => {
            return (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {flha.company_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {flha.user_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {flha.user_email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {flha.data.ppe_inspected ? "True" : "False"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {flha.data.todo}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {flha.data.site_location}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    <DateTimeUtility
                      timestamp={flha.submitted_at}
                    ></DateTimeUtility>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {flha.data.flhf.map((item, index) => (
                    <div
                      key={index}
                      className="text-sm font-medium text-gray-900"
                    >
                      {item}
                    </div>
                  ))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {flha.data.ergonomics.map((item, index) => (
                    <div
                      key={index}
                      className="text-sm font-medium text-gray-900"
                    >
                      {item}
                    </div>
                  ))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {flha.data.aeHazards.map((item, index) => (
                    <div
                      key={index}
                      className="text-sm font-medium text-gray-900"
                    >
                      {item}
                    </div>
                  ))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {flha.data.ouHazards.map((item, index) => (
                    <div
                      key={index}
                      className="text-sm font-medium text-gray-900"
                    >
                      {item}
                    </div>
                  ))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {flha.data.evtHazards.map((item, index) => (
                    <div
                      key={index}
                      className="text-sm font-medium text-gray-900"
                    >
                      {item}
                    </div>
                  ))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {flha.data.plHazards.map((item, index) => (
                    <div
                      key={index}
                      className="text-sm font-medium text-gray-900"
                    >
                      {item}
                    </div>
                  ))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {flha.data.hazards_remaining ? "True" : "False"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {flha.data.permits_closed_out ? "True" : "False"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {flha.data.incident ? "True" : "False"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {flha.data.area_cleaned_up ? "True" : "False"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {flha.data.master_point_location}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {flha.signature_base64 ? (
                    <Image
                      src={flha.signature_base64}
                      alt="Signature"
                      className="w-auto"
                      width={100}
                      height={100}
                    />
                  ) : (
                    <span className="text-sm text-gray-500">No Signature</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RegesterdFLHATable;
