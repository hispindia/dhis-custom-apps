import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get the ID from the URL
import "./style.scss";
import { ApiService } from "../../services/apiService";

const IndicatorDetails = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>Display Short Name</th>
            <th>Numerator Description</th>
            <th>Denominator Description</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    );
  };

export default IndicatorDetails;

