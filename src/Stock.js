import { useState, useEffect } from "react";
import { AiFillCaretUp, AiFillCaretDown } from "react-icons/ai";
import Chart from "./components/Chart";
import Loading from "./components/Loading";
import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import useFetch from "./hooks/useFetch";
import { Select, MenuItem, FormControl, Button, IconButton } from "@mui/material";
import { FaPlus, FaRegBell } from 'react-icons/fa';

const Stock = () => {
  const [pdata, setPdata] = useState([]);
  const [isDataPresent, setIsDataPresent] = useState(false);
  const [priceChange, setPriceChange] = useState(0.0);
  const [selectedStock, setSelectedStock] = useState("");
  const [selectedStockValue, setSelectedStockValue] = useState(0);
  const [graphData, setGraphData] = useState({});

  const { data: stocksOwned, isPending } = useFetch(
    `http://localhost:8000/stocks`
  );

  useEffect(() => {
    if (stocksOwned) {
      for (var i in stocksOwned) {
        const item = stocksOwned[i];
        const symbol = item.name;
        const data = item.data;
        let x = graphData;
        x[symbol] = data.reverse();
        setGraphData(x);
        let t = x[selectedStock];
        if (t) {
          setPriceChange(t[t.length - 1]["value"] - t[t.length - 2]["value"]);
          setPdata(t);
          setIsDataPresent(true);
        }
      }
      setSelectedStock(stocksOwned[0].name);
      setSelectedStockValue(stocksOwned[0].stocks);
    }
  }, [stocksOwned]);

  useEffect(() => {
    if (Object.keys(graphData).length !== 0) {
      let list = graphData[selectedStock];
      if (list) {
        setPriceChange(
          list[list.length - 1]["value"] - list[list.length - 2]["value"]
        );
        setPdata(list);
        setIsDataPresent(true);
      }
    }
  }, [selectedStock]);

  const handleStockChanged = (e) => {
    var name = e.target.value;
    let value = 0;
    for (var i in stocksOwned) {
      var item = stocksOwned[i];
      if (item["name"] === name) {
        value = item["stocks"];
      }
    }
    setSelectedStock(name);
    setSelectedStockValue(value);
  };

  return (
    <div className="total-stock-page">
      {!isPending && (
        <div className="top-of-page">
          <FormControl className="dropdown" variant="standard">
          <Select
            size="small"
            style={{fontSize:"3vh"}}
            name="Stock"
            id="stock"
            value={ selectedStock }
            onChange={handleStockChanged}
          >
            {stocksOwned &&
              stocksOwned.map((item) => (
                <MenuItem value={item.name} key={item.name}>
                  {item.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <div className="top-options">
        <IconButton style={{color:"black", marginRight:"1vw", border:"1px solid black" , backgroundColor:"white"}}><FaRegBell></FaRegBell></IconButton>
        <Button variant="outlined" 
        style={{color:"black", borderColor:"black", fontSize:"2vh", backgroundColor:"white"}} 
        startIcon={ <FaPlus></FaPlus> }
        onClick = {()=>{
          alert("Added to watchlist!!!!");
        }}
        >Add to WatchList</Button>
        </div>
      </div>
      )}
      <div className="stock-page">
        {!isDataPresent && <Loading />}
        {isDataPresent && (
          <div className="stock-graph">
          {isDataPresent && <Chart pdata={pdata} priceChange={priceChange} />}
          </div>
        )}
        {isDataPresent && 
          <div className="side-cards">
          <div className="stock-name">{selectedStock}</div>
          <div className="stock-currentval">
            <div className="stock-currentval-label">Current Value</div>
            <div className="stock-currentval-value">
              {pdata[pdata.length - 1]["value"]} USD
            </div>
          </div>
          <div className="stock-currentval">
            <div className="stock-currentval-label">Net Inc/Dec</div>
            <div className={priceChange <= 0 ? "red " : "green "}>
              {priceChange > 0 ? <AiFillCaretUp /> : <AiFillCaretDown />}
              {(
                (priceChange * 100) /
                pdata[pdata.length - 2]["value"]
              ).toFixed(2)}
              %
            </div>
          </div>
          <div className="stock-currentval">
            <div className="stock-currentval-label">Stocks Owned</div>
            <div className="stock-currentval-value">{selectedStockValue}</div>
          </div>
          <div className="stock-currentval">
            <div className="stock-currentval-label">Net Profit/Loss</div>
            <div className={priceChange <= 0 ? "red " : "green "}>
              {priceChange > 0 ? <AiFillCaretUp /> : <AiFillCaretDown />}
              {(selectedStockValue * priceChange).toFixed(2)} USD
            </div>
          </div>
        </div>
        }
      </div>
      {isDataPresent && (
        <div className="bottom-table">
          <Paper
            sx={{
              width: "90%",
              overflow: "hidden",
              backgroundColor: "white",
              margin: "auto",
              borderRadius: "5px",
            }}
          >
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="table-cell">Stock Name</TableCell>
                    <TableCell className="table-cell">Stocks Owned</TableCell>
                    <TableCell className="table-cell">Stock CP</TableCell>
                    <TableCell className="table-cell">
                      Crypto Current Price
                    </TableCell>
                    <TableCell className="table-cell">
                      Net Profit/Loss
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ fontSize: "80%", textAlign: "center" }}>
                  {stocksOwned.map((stock) => {
                    return (
                      <TableRow key={stock.name}>
                        <TableCell>{stock["name"]}</TableCell>
                        <TableCell>{stock["stocks"]}</TableCell>
                        <TableCell>
                          {graphData[stock.name][
                            graphData[stock.name].length - 2
                          ]["value"].toFixed(2)}{" "}
                          USD
                        </TableCell>
                        <TableCell>
                          {
                            graphData[stock.name][
                              graphData[stock.name].length - 1
                            ]["value"]
                          }{" "}
                          USD
                        </TableCell>
                        <TableCell
                          sx={{
                            color:
                              graphData[stock.name][
                                graphData[stock.name].length - 1
                              ]["value"] -
                                graphData[stock.name][
                                  graphData[stock.name].length - 2
                                ]["value"] >
                              0
                                ? "green"
                                : "red",
                          }}
                        >
                          {(
                            (graphData[stock.name][
                              graphData[stock.name].length - 1
                            ]["value"] -
                              graphData[stock.name][
                                graphData[stock.name].length - 2
                              ]["value"]) *
                            stock["stocks"]
                          ).toFixed(2)}{" "}
                          USD
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
      )}
    </div>
  );
};

export default Stock;
