
'use client';
import React, { useState, useEffect } from 'react';
import api from '@/service/api';
import {
    Box
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  // ID column is not explicitly defined here, but `id` field exists in rows.
  // Mui X-Data-Grid will use the 'id' field by default if it exists in the row data.
  {
    field: 'timestamp',
    headerName: 'Timestamp',
    flex: 2,
    renderCell: (params) => {
      // Ensure there is a value to format.
      if (!params.value) {
        return '';
      }

      const date = new Date(params.value);

      // Fallback for invalid date strings.
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }

      // Define formatting options for a clear, readable date and time.
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // Use 24-hour format
      };

      // Use 'fr-FR' locale to format the date according to French conventions.
      // This will correctly handle date/time formatting for your location.
      return date.toLocaleString('fr-FR', options);
    },
  },
  {
    field: 'countryFlag', // This field should contain the 2-letter country code, e.g., "US", "FR"
    headerName: 'Country',
    flex: 1.5, // Increased flex to accommodate flag and full name
    renderCell: (params) => {
      // Ensure there is a country code to process
      if (!params.value) {
        return null; // Or return a placeholder like 'N/A'
      }

      const countryCode = params.value.toUpperCase();

      // Use the built-in Intl API to get the full country name from its code.
      // 'en' specifies that the output name should be in English.
      const countryName = new Intl.DisplayNames(['en'], { type: 'region' }).of(countryCode);

      // Construct the URL for the flag image from a CDN.
      const flagUrl = `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;

      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src={flagUrl}
            alt={`Flag of ${countryName}`}
            style={{ width: '20px', height: 'auto', flexShrink: 0 }}
            // Basic error handling in case the flag image fails to load
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <span>{countryName}</span>
        </div>
      );
    },
  },
  { field: 'ip', headerName: 'IP Address', flex: 1.2 },
  { field: 'browserAgent', headerName: 'Browser Agent', flex: 3 },
  { field: 'statusCode', headerName: 'Status Code', type: 'number', flex: 0.8 },
  { field: 'wafDecision', headerName: 'Decision', flex: 1 },
  { field: 'wafReason', headerName: 'Reason', flex: 3 }
];

const paginationModel = { page: 0, pageSize: 10 };


const ProductPerformance = () => {
  const [requests, setRequests] = useState([]);
  const fetchRequests = async () => {
    try {
      const { data: req } = await api.get('/api/v1/fetch-requests');
      const o = req.requests.map( (r: any, i: any) => {
        return {
          id: i,
          timestamp: r.timestamp,
          countryFlag: r.countryCode,
          ip: r.ipAddress,
          browserAgent: r?.requestHeaders['user-agent'] || null,
          statusCode: r.statusCode,
          wafDecision: r.wafDecision,
          wafReason: r.wafDecisionReason,
          ruleset: null
        }
      })
      setRequests(o);
    } catch (e) {
      console.error(e);
    }
  }
  useEffect( () => {
    fetchRequests();
  }, [])
  return (
      <DataGrid
          rows={requests}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[10, 15, 20]}
          sx={{ border: 0 }}
      />
  );
};

export default ProductPerformance;
