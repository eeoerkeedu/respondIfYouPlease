// importing utility dependancies
import { useState, useEffect } from "react";
import Auth from "../utils/auth";

// import styling dependancies
import { Box, Container, Image, Link, ScaleFade } from "@chakra-ui/react";

// extract username from token.
let username = Auth.loggedIn() ? Auth.getProfile().data.username : "";
// console.log(user);

// page rendering
function Home() {
	return (
		// overall containter
		<Container
			// h="100%"
			// height="100vh"
			width="100%"
			maxWidth="100vw"
			centercontent="true"
		></Container>
	);
}

export default Home;
