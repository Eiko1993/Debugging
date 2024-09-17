import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [last, setLast] = useState(null);
  const getData = useCallback(async () => {
    try {
      const fetchedData = await api.loadData();
      setData(fetchedData);

      // Assuming the events are sorted by date in ascending order in the JSON
      if (fetchedData?.events?.length > 0) {
        // Sort events by date to get the latest one
        const sortedEvents = fetchedData.events.sort((a, b) => new Date(b.date) - new Date(a.date));
        setLast(sortedEvents[0]); // Récupère le dernier évènement
      }

    } catch (err) {
      setError(err);
    }
  }, []);

  useEffect(() => {
    if (!data) getData();
  }, [data, getData]);

  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
        last, // Provide `last` event in the context
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);

export default DataContext;
