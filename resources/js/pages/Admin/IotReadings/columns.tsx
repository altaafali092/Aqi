import { ColumnDef } from "@tanstack/react-table";
import { IotReading } from '@/types/Admin/IotReading';

export const columns: ColumnDef<IotReading>[] = [
    {
        accessorKey: "id",
        header: "#",
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: "ward.number",
        header: "Ward",
    },
    {
        accessorKey: "pm2_5",
        header: "PM2.5 (µg/m³)",
        cell: ({ row }) => (row.original.pm2_5 ?? '-'),
    },
    {
        accessorKey: "pm10",
        header: "PM10 (µg/m³)",
        cell: ({ row }) => (row.original.pm10 ?? '-'),
    },
    {
        accessorKey: "temperature",
        header: "Temp (°C)",
        cell: ({ row }) => (row.original.temperature ?? '-'),
    },
    {
        accessorKey: "humidity",
        header: "Humidity (%)",
        cell: ({ row }) => (row.original.humidity ?? '-'),
    },
    {
        accessorKey: "recorded_at",
        header: "Recorded At",
        cell: ({ row }) => new Date(row.original.recorded_at).toLocaleString(),
    },
];