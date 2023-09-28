import { Typography, Grid, FormControl, InputAdornment, FormControlLabel, FormLabel, Radio, RadioGroup, Select, MenuItem } from "@mui/material";
import { AppBar, Toolbar, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import "./App.css";
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ComposedChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, LabelList } from "recharts";
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import ResultTable from "./table";

const GREEN_PALETTE = ["#08E17B", "#4CAF50", "#107C41", "00563F"];

const partyColors = {
    Alliance: GREEN_PALETTE[0],
    Congress: GREEN_PALETTE[1],
    Democratic: GREEN_PALETTE[2],
    Progressive: GREEN_PALETTE[3]
};

// function AllResultsTable (props) {
//     const rowItems = props.results.map((result) => {
//         return (
//             <TableBody>
//                 <TableRow>
//                     <TableCell>{result.electionId}</TableCell>
//                     <TableCell>{result.electionPollingCentre}</TableCell>
//                     <TableCell>{JSON.stringify(result.electionVotes.votesParties)}</TableCell>
//                     <TableCell>{result.electionVotes.voteTotal}</TableCell>
//                     <TableCell>{result.electionOfficerId}</TableCell>
//                     <TableCell>{result.electionDate}</TableCell>
//                 </TableRow>
//             </TableBody>
//         )
//     });
    
//     return (
//         <Table>
//         <TableHead>
//             <TableRow>
//             <TableCell>Election ID</TableCell>
//             <TableCell>Polling Centre</TableCell>
//             <TableCell>Party</TableCell>
//             <TableCell>Vote Count</TableCell>
//             <TableCell>Officer ID</TableCell>
//             <TableCell>Election Date</TableCell>
//             </TableRow>
//         </TableHead>
//         {rowItems}
//         </Table>
//     )
// }

const getResults = async (setElectionResults, setLoading, setError) => {
    try {
        setLoading(true);
        const myHeaders = new Headers();
        const myRequest = new Request(`https://9656mgkl5a.execute-api.eu-west-2.amazonaws.com/dev/fetch/document/State`, {
            method: "GET",
            headers: myHeaders,
            mode: "cors",
            cache: "default",
        });
        const response = await fetch(myRequest);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setElectionResults(data);
        setLoading(false);
    } catch (err) {
        setError(err);
        setLoading(false);
    }
};

const Box = ({ children, ...props }) => <div {...props}>{children}</div>;

const Card = ({ children }) => (
    <Box style={{ flex: '0 0 calc(50% - 10px)', margin: '5px', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
        {children}
    </Box>
);

// class Home extends React.Component {

//     constructor(props) {
//         super(props);
//         this.state = { results: [] };
//         // this.handleStatusChange = this.handleStatusChange.bind(this);
//     }

//     componentDidMount() {
//         getResults()
//         .then(async res => {
//             const results = await res;
//             if (results) this.setState({results: results._resultList });
//         })
//     }

//     render() {
//         if (this.state.results.length < 1) {
//           return 'Loading...';
//         }

//         return (
//             <AllResultsTable results = {this.state.results}/>
//         )

        
//     }

    // handleStatusChange(status) {
    //     this.setState({
    //       isOnline: status.isOnline
    //     });
    // }
function getColorForParty(partyName) {
    return partyColors[partyName] || '#000'; // default color if party is not in the list
}
    
function Home() {
    const navigate = useNavigate();
    const [electionResults, setElectionResults] = useState(null);
    const [results, setResults] = useState([]);
    const [viewResults, setViewResults] = useState(false);

    const [showSearchOptions, setShowSearchOptions] = useState(false);
    const [isSearchFormVisible, setIsSearchFormVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [locations, setLocations] = useState([]);

    const [selectedState, setSelectedState] = useState("");
    const [selectedLGA, setSelectedLGA] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const [selectedPollingUnit, setSelectedPollingUnit] = useState("");
    const [lgas, setLgas] = useState([]);
    const [wards, setWards] = useState([]);
    const [pollingUnits, setPollingUnits] = useState([]);

    useEffect(() => {
        getResults(setElectionResults, setLoading, setError);
    }, []);

    const partyVotes = electionResults?.electionVotes?.votesParties || [];


    const toggleSearchOptions = () => {
        setShowSearchOptions(!showSearchOptions);
        setIsSearchFormVisible(prevVisible => !prevVisible);
    };

    const SectionContainer = ({ children }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            {children}
        </div>
        );

            const RADIAN = Math.PI / 180;
            const renderCustomizedLabel = ({
                cx, cy, midAngle, innerRadius, outerRadius, percent
            }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                return (
                    <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
                        {`${(percent * 100).toFixed(0)}%`}
                    </text>
                );
            };

            useEffect(() => {
                const fetchLocations = async () => {
                    try {
                        const myHeaders = new Headers();
                        const myRequest = new Request(`https://9656mgkl5a.execute-api.eu-west-2.amazonaws.com/dev/fetch/document/ElectionResults`, {
                            method: "GET",
                            headers: myHeaders,
                            mode: "cors",
                            cache: "default",
                        });
                        const response = await fetch(myRequest);
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        const data = await response.json();
                        const locationData = {
                            pollingCentre: data.electionPollingCentre,
                            ward: data.electionWard,
                            lga: data.electionLga,
                            state: data.electionState,
                            federal: data.electionFederal
                        };
                        setLocations(locationData);
                    } catch (error) {
                        console.error("Error fetching locations:", error);
                    }
                };
                
            
                fetchLocations();
            }, []);

            useEffect(() => {
                const selectedStateData = locations.find(loc => loc.state === selectedState);
                if (selectedStateData) {
                    setLgas(selectedStateData.lga);
                    setSelectedLGA(selectedStateData.lga[0]?.name);
                }
            }, [selectedState]);

            useEffect(() => {
                const selectedLGAData = lgas.find(lga => lga.name === selectedLGA);
                if (selectedLGAData) {
                    setWards(selectedLGAData.ward);
                    setSelectedWard(selectedLGAData.ward[0]?.name);
                }
            }, [selectedLGA, lgas]);

            useEffect(() => {
                const selectedWardData = wards.find(ward => ward.name === selectedWard);
                if (selectedWardData) {
                    setPollingUnits(selectedWardData.pollingUnit);
                    setSelectedPollingUnit(selectedWardData.pollingUnit[0]);
                }
            }, [selectedWard, wards]);

    const [currentUnit, setCurrentUnit] = useState("state"); // to determine which dropdown to display
    const [selectedUnit, setSelectedUnit] = useState('');   // value of the selected dropdown item

    const handleRadioChange = (event) => {
        setCurrentUnit(event.target.value);
        setSelectedUnit('');
    };

    const handleDropdownChange = (event) => {
        setSelectedUnit(event.target.value);

        switch (currentUnit) {
            case 'state':
                setSelectedState(event.target.value);
                break;
            case 'lga':
                setSelectedLGA(event.target.value);
                break;
            case 'ward':
                setSelectedWard(event.target.value);
                break;
            case 'pollingUnit':
                setSelectedPollingUnit(event.target.value);
                break;
            default:
                break;
        }
    };

    const renderDropdownOptions = () => {
        switch (currentUnit) {
            case 'state':
                return locations.map(s => <MenuItem value={s.state} key={s.state}>{s.state}</MenuItem>);
            case 'lga':
                return lgas.map(l => <MenuItem value={l.name} key={l.name}>{l.name}</MenuItem>);
            case 'ward':
                return wards.map(w => <MenuItem value={w.name} key={w.name}>{w.name}</MenuItem>);
            case 'pollingUnit':
                return pollingUnits.map(p => <MenuItem value={p} key={p}>{p}</MenuItem>);
            default:
                return null;
        }
    };

    const fetchAndNavigate = async () => {
        await getResults();  // Assuming you have a fetchResults function
        navigate('/results');
    };
    

    function StateChart({ data }) {
        return (
            <div>
                <ComposedChart
                    layout="vertical"
                    width={400}
                    height={200}
                    data={data}
                    //     name: stateData.labels[index],
                    //     votes: value,
                    //     avg: 25
                    // }))}
                    margin={{top: 20, right: 20, bottom: 20, left: 50}} >
                    fill={}
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis type="number" ticks={[0, 25, 50, 75 ]} />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    {data.map(party => (

                    <Bar 
                        key={party.name}
                        dataKey="voteCount" barSize={30}
                        name={data?.[0]?.name || ''} 
                        fill={getColorForParty(data?.[0]?.name)}>
                   
                        <LabelList dataKey="voteCount" position="right" formatter={(value) => `${value}%`} />
                    </Bar>
                    ))}
                    <Line dataKey="voteCount" stroke="#ff7300" />
                </ComposedChart>

                <SectionContainer title="State">
                    <Typography variant="h6" className="typography-margin">{selectedState}</Typography>
                    <Button onClick={fetchAndNavigate}>View Result</Button>
                    {/* <div>
                        <Button onClick={() => {
                            getResults();
                            setViewResults(true);
                        }}>
                            View Result
                        </Button>

                        {viewResults && results && <ResultTable results={results} />}
                    </div> */}
                </SectionContainer>
            </div>
        );
   }

   function LGAChart({ data }) {
    return (
        <div>
            <PieChart width={400} height={200} margin={{left: 50, top: 20 }} > 
                <Pie
                    dataKey="voteCount"
                    data={data}
                    cx={80}
                    cy={80}
                    labelLine={false}
                    outerRadius={90}
                    label={renderCustomizedLabel} 
                    >
                        {data.map((party, index) => (
                        <Cell key={party.name} fill={getColorForParty(party.name)} />
                    ))}
                </Pie>
                <Legend verticalAlign="top" align="right" layout="vertical" />
            </PieChart>
            <SectionContainer title="Local Government Area">
                <Typography variant="h6" className="typography-margin">{selectedLGA}</Typography>
                <button className="view-result-button">View Result</button>
            </SectionContainer>
        </div>
    );
}

function WardChart ({ data }) {
    return (
        <div>
            <PieChart width={400} height={200}  margin={{left: 50 }}>
                <Pie
                    data={data}
                    cx={80}
                    cy={100}
                    innerRadius={40}
                    labelLine={false}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="voteCount"
                    label={renderCustomizedLabel} 
                >
                    {data.map((party, index) => (
                    <Cell key={party.name} fill={getColorForParty(party.name)} />
                    ))}
                </Pie>
                <Legend verticalAlign="top" align="right" layout="vertical" />
            </PieChart>
            <SectionContainer title="Ward">
                <Typography variant="h6" className="typography-margin">{selectedWard}</Typography>
                <button className="view-result-button">View Result</button>
            </SectionContainer>
        
        </div>
    );
}

function PollingCentreChart({ data }) {
    return (
        <div>
            <BarChart width={300} height={200}
                data={data} >
                <XAxis dataKey="name" />
                <YAxis ticks={[0, 25, 50, 75 ]}/>
                <Tooltip />
                {data.map(party => (
                <Bar 
                    key={party.name}
                    dataKey="voteCount"
                    fill={getColorForParty(party.name)}
                >                        
                    <LabelList dataKey="votes" position="top" formatter={(value) => `${value}%`} />
                </Bar>
                ))}
            </BarChart> 
            <SectionContainer title="Polling Unit">
                <Typography variant="h6" className="typography-margin">{selectedPollingUnit}</Typography>
                <button className="view-result-button">View Result</button>
            </SectionContainer>
        </div>
    );
} 
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <>
            {/* <Box>
                Results
            </Box>
            <Box>
                {JSON.stringify(results)}
            </Box>
        </>
      <> */}
        <AppBar position="static" sx={{ backgroundColor: 'green' }}>
          <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              e-lections
              </Typography>
                <SearchIcon 
                onClick={toggleSearchOptions}
                aria-label="Toggle search options"
                className="search-icon"/>
                <a className="account-button" href={`/dashboard`}>Account</a>
          </Toolbar>
        </AppBar>
        <Box className="box">
            <FormControl className="form-control">
                <InputAdornment position="start">
                    {isSearchFormVisible && (
                        <FormControl className="form-control">
                            <InputAdornment position="start" />
                        </FormControl>
                    )}
                </InputAdornment>
            </FormControl>
            {showSearchOptions && (
            <>
                <FormControl component="fieldset" className="form-control">
                    <FormLabel component="legend">Select Unit</FormLabel>
                    <RadioGroup row name="unit" value={currentUnit} onChange={handleRadioChange}>
                        <FormControlLabel value="state" control={<Radio />} label="State" />
                        <FormControlLabel value="lga" control={<Radio />} label="LGA" />
                        <FormControlLabel value="ward" control={<Radio />} label="Ward" />
                        <FormControlLabel value="pollingUnit" control={<Radio />} label="Polling Unit" />
                    </RadioGroup>
                </FormControl>

                <FormControl variant="outlined" className="dropdown">
                    <Select value={selectedUnit} onChange={handleDropdownChange}>
                        {renderDropdownOptions()}
                    </Select>
                </FormControl>
                </>
            )}

            {/* <Grid className="national-grid-container">
                <Card className="card">
                        <SectionContainer title="Federal">
                            <Typography></Typography>
                            <button className="view-result-button">View Result</button>
                        </SectionContainer>                    
                        <Typography variant="h6" className="unit-header">National Result</Typography>
                        <Box className="national-party-box">
                        <Box className="national-party-cards">
                            {federalData.labels.map((party, index) => (
                                <Box key={party} className="national-party-card" style={{backgroundColor: partyColors[party]}}>
                                    {party}
                                    <Typography className="national-party-typography">
                                        {(federalData.datasets[0].data[index] * 100).toFixed(2)}%
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Card>
            </Grid> */}

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card className="card"> 
                        <StateChart data={electionResults?.electionVotes.votesParties || []} />
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card className="card">
                        <LGAChart data={[{ name: 'LGA', votes: electionResults?.voteTotal - (electionResults?.voteTotal - electionResults?.electionVotes.votesParties.reduce((a, b) => a + parseInt(b.voteCount, 10), 0)) }, ...electionResults?.electionVotes.votesParties]} />
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card className="card">
                        <WardChart data={[{ name: 'Ward', votes: electionResults?.voteTotal - (electionResults?.voteTotal - electionResults?.electionVotes.votesParties.reduce((a, b) => a + parseInt(b.voteCount, 10), 0)) }, ...electionResults?.electionVotes.votesParties]} />
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card className="card">
                        <PollingCentreChart data={electionResults?.electionVotes.votesParties || []} />
                    </Card>
                </Grid>
            </Grid>
        </Box>
    </>
    );
}

export default Home;