import { FormControl, InputGroup, Container, Button, Row, Card, Accordion, Col} from "react-bootstrap";
import { useState, useEffect } from "react";
import './App.css'

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    let authParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        clientId +
        "&client_secret=" +
        clientSecret,
    };

    fetch("https://accounts.spotify.com/api/token", authParams)
      .then((result) => result.json())
      .then((data) => {
        setAccessToken(data.access_token);
      });
  }, []);

  async function search() {
    let artistParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    // Get Artist
    const artistID = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
      artistParams
    )
      .then((result) => result.json())
      .then((data) => {
        return data.artists.items[0].id;
      });

      // Get Artist Albums
      await fetch(
        "https://api.spotify.com/v1/artists/" +
          artistID +
          "/albums?include_groups=album&market=US&limit=50",
        artistParams
      )
        .then((result) => result.json())
        .then((data) => {
          setAlbums(data.items);
      });
  }

  return (
      <>
        <Container>
        <div className="hero-section">
          <svg
            className="spotify-logo"
            width="60"
            height="60"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="#1DB954">
              <path d="M224,460 C210.8,460 200,470.8 200,484 C200,497.2 210.8,508 224,508 C237.2,508 248,497.2 248,484 C248,470.8 237.32,460 224,460 M238.16,481.36 C230.48,476.8 217.64,476.32 210.32,478.6 C209.12,478.96 207.92,478.24 207.56,477.16 C207.2,475.96 207.92,474.76 209,474.4 C217.52,471.88 231.56,472.36 240.44,477.64 C241.52,478.24 241.88,479.68 241.28,480.76 C240.68,481.6 239.24,481.96 238.16,481.36 M237.92,488.08 C237.32,488.92 236.24,489.28 235.4,488.68 C228.92,484.72 219.08,483.52 211.52,485.92 C210.56,486.16 209.48,485.68 209.24,484.72 C209,483.76 209.48,482.68 210.44,482.44 C219.2,479.8 230,481.12 237.44,485.68 C238.16,486.04 238.52,487.24 237.92,488.08 M235.04,494.68 C234.56,495.4 233.72,495.64 233,495.16 C227.36,491.68 220.28,490.96 211.88,492.88 C211.04,493.12 210.32,492.52 210.08,491.8 C209.84,490.96 210.44,490.24 211.16,490 C220.28,487.96 228.2,488.8 234.44,492.64 C235.28,493 235.4,493.96 235.04,494.68" transform="translate(-200 -460)"></path>
            </g>
          </svg>
          <h1 className="hero-title">Buscador de Álbumes</h1>
        </div>

        <Accordion
        style={{
          marginBottom: 10
        }}>
          <Accordion.Item eventKey="0">
            <Accordion.Header>¿Cómo se usa?</Accordion.Header>
            <Accordion.Body>
              ¡Es fácil! Simplemente ingresá el nombre del artista <br></br>
              que querés buscar para ver sus álbumes publicados <br></br> en Spotify.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <InputGroup>
          <FormControl
            placeholder="Search For Artist"
            type="input"
            aria-label="Search for an Artist"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                search();
              }
            } }
            onChange={(event) => setSearchInput(event.target.value)}
            style={{
              width: "300px",
              height: "35px",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: "#888",
              borderRadius: "5px",
              marginRight: "10px",
              paddingLeft: "10px",
            }} />

          <Button onClick={search} variant="success">Search</Button>
        </InputGroup>
      </Container>
      <Container>
          <Row>
         {
            albums.map((album) => {
              return(
                <Col key={album.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                  <Card>
                    <Card.Img
                      src={album.images[0].url}
                      style={{borderRadius: '4%',}}
                    />
                    <Card.Body>
                      <Card.Title
                        style={{
                          whiteSpace: 'wrap',
                          fontWeight: 'bold',
                          maxWidth: '200px',
                          fontSize: '18px',
                          marginTop: '10px',
                      }}>
                        {album.name}
                      </Card.Title>

                      <Card.Text>
                        Release Date: <br></br> {album.release_date}
                      </Card.Text>
                      <Button
                        href={album.external_urls.spotify} variant="success">
                        Album Link
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              )
            })
          }
        </Row>
      </Container></>
  )
}

export default App
