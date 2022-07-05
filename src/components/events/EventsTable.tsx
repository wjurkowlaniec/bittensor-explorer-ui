import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { eventsState } from "../../state/events";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import { EventsFilter, getEvents } from "../../services/eventsService";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Link, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { Search } from "@mui/icons-material";
import EventsTableRow from "./EventsTableRow";
import EventParamsTable from "./EventParamsTable";
import { shortenHash } from "../../utils/shortenHash";
import {
  convertTimestampToTimeFromNow,
  formatDate,
} from "../../utils/convertTimestampToTimeFromNow";
import { usePagination } from "../../hooks/usePagination";
import PaginatedTable from "../PaginatedTable";

const HeaderTableRow = styled(TableRow)`
  th {
    font-weight: bold !important;
  }
`;

type Page = {
  limit: number;
  offset: number;
};

function EventsTable() {
  const [events, setEvents] = React.useState<any>([]);
  const [checked, setChecked] = React.useState(true);
  const [filter, setFilter] = React.useState<EventsFilter>({
    section: { _eq: "" },
    method: { _eq: "" },
    extrinsic: {
      signer: { _eq: "" },
      isSigned: { _eq: true },
    },
  });
  const pagination = usePagination(10, true);

  const navigate = useNavigate();

  const handleChangeOnlySignedCheckbox = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setChecked(event.target.checked);
    // remove isSigned from filter if unchecked
    if (event.target.checked) {
      setFilter({
        ...filter,
        extrinsic: {
          ...filter.extrinsic,
          isSigned: { _eq: true },
        },
      });
    } else {
      if (filter.extrinsic) {
        delete filter.extrinsic.isSigned;
      }
      setFilter(filter);
    }
  };

  useEffect(() => {
    const getEventsAndSetState = async (
      limit: number,
      offset: number,
      filter?: EventsFilter
    ) => {
      const events = await getEvents(limit, offset, filter || {});
      setEvents(events);
    };
    getEventsAndSetState(pagination.limit, pagination.offset, filter);
    const interval = setInterval(async () => {
      await getEventsAndSetState(pagination.limit, pagination.offset, filter);
    }, 10000);
    return () => clearInterval(interval);
  }, [
    filter.section,
    filter.method,
    filter.extrinsic?.signer,
    filter.extrinsic?.isSigned,
    filter,
    pagination.offset,
    pagination.limit,
    pagination,
    setEvents,
  ]);

  return (
    <PaginatedTable
      extra={
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                inputProps={{ "aria-label": "controlled" }}
                onChange={(e) => handleChangeOnlySignedCheckbox(e)}
              />
            }
            label="Only signed"
          />
        </FormGroup>
      }
      pagination={pagination}
      title="Events"
    >
      <TableHead>
        <HeaderTableRow>
          <TableCell />
          <TableCell>Id</TableCell>
          <TableCell>
            <Grid container spacing={2}>
              <Grid item style={{ margin: "auto" }}>
                Section
              </Grid>
              <Grid item>
                <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                  <TextField
                    InputProps={{
                      startAdornment: <Search />,
                    }}
                    id="search-section"
                    onChange={(e) => {
                      setFilter({
                        ...filter,
                        section: { _eq: e.target.value },
                      });
                    }}
                    size="small"
                    variant="filled"
                  />
                </Box>
              </Grid>
            </Grid>
          </TableCell>
          <TableCell>
            <Grid container spacing={2}>
              <Grid item style={{ margin: "auto" }}>
                Method
              </Grid>
              <Grid item>
                <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                  <TextField
                    InputProps={{
                      startAdornment: <Search />,
                    }}
                    id="search-method"
                    onChange={(e) => {
                      setFilter({ ...filter, method: { _eq: e.target.value } });
                    }}
                    size="small"
                    variant="filled"
                  />
                </Box>
              </Grid>
            </Grid>
          </TableCell>
          <TableCell>Is signed</TableCell>
          <TableCell>
            <Grid container spacing={2} wrap="nowrap">
              <Grid item style={{ margin: "auto" }}>
                Signer
              </Grid>
              <Grid item>
                <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                  <TextField
                    InputProps={{
                      startAdornment: <Search />,
                    }}
                    id="search-signer"
                    onChange={(e) => {
                      setFilter({
                        ...filter,
                        extrinsic: {
                          ...filter.extrinsic,
                          signer: { _eq: e.target.value },
                        },
                      });
                    }}
                    size="small"
                    variant="filled"
                  />
                </Box>
              </Grid>
            </Grid>
          </TableCell>
          <TableCell>Extrinsic hash</TableCell>
          <TableCell>Time</TableCell>
          <TableCell />
        </HeaderTableRow>
      </TableHead>
      <TableBody>
        {events.map((event: any) => (
          <EventsTableRow
            expandComponent={<EventParamsTable params={event.params} />}
            key={event.id}
            sx={{
              "&:last-child td, &:last-child th": { border: 0 },
            }}
          >
            <TableCell>{event.id}</TableCell>
            <TableCell>{event.section}</TableCell>
            <TableCell>{event.method}</TableCell>
            <TableCell>
              {event.extrinsic.isSigned ? <CheckCircleIcon /> : <CancelIcon />}
            </TableCell>
            <TableCell>{shortenHash(event.extrinsic.signer)}</TableCell>
            <TableCell>
              <Link to={`/extrinsic/${event.extrinsic.id}`}>
                {shortenHash(event.extrinsic.hash)}
              </Link>
            </TableCell>
            <TableCell>
              <Tooltip placement="top" title={formatDate(event.created_at)}>
                <span>{convertTimestampToTimeFromNow(event.created_at)}</span>
              </Tooltip>
            </TableCell>
          </EventsTableRow>
        ))}
      </TableBody>
    </PaginatedTable>
  );
}

export default EventsTable;
