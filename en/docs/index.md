<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
<div class="homePage">
    <div class="section01">
        <div class="leftContent">
            <div class="about-home">
                <div>
				    <header>
						<h1>Welcome to the WSO2 Open Health Care Documentation!</h1>
					</header>
					<div class="md-main .md-content">
						<p> 
						API-driven interoperability, seamless and secure health data exchange, and health data transformation with prebuilt Fast Healthcare Interoperability Resources (FHIR®) accelerators for rapid implementation by meeting regulatory compliance requirements.
						</p>
						<p>
						Get a head start with our Quick Start Guide or dive straight into the documentation to understand what we offer 
						and to discover the extensibility.
						</p>
					</div>
                </div>
                <div>
                        <div class="md-main .md-content ">
							<iframe width="800" height="250" src="https://www.youtube.com/embed/YabdNpDlS2s" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
						</div>
                </div>
            </div>
        </div>
    </div>
    <div class="section02">
        <div class="linkWrapper">
            <div class="linkSet2" onclick="location.href='{{base_path}}/get-started/open-healthcare';">
                <a href="get-started/open-healthcare"><h3>Quick Start Guide</h3></a>
                <p>
                    Set up and try out in your local environment
                </p>
            </div>
        </div>
    </div>
	<div class="section03">
        <h3>What can WSO2 Open Healthcare do?</h3>
        <div class="linkWrapper">
            <div class="linkSet3" onclick="location.href='{{base_path}}/get-started/open-healthcare';">
                <a href="get-started/open-healthcare"><h3>Quick Start Guide</h3></a>
                <p>
                    Set up and try out in your local environment
                </p>
            </div>
            <div class="linkSet3" onclick="location.href='{{base_path}}/get-started/open-healthcare';">
                <a href="get-started/open-healthcare"><h3>Quick Start Guide</h3></a>
                <p>
                    Set up and try out in your local environment
                </p>
            </div>
            <div class="linkSet3" onclick="location.href='{{base_path}}/get-started/open-healthcare';">
                <a href="get-started/open-healthcare"><h3>Quick Start Guide</h3></a>
                <p>
                    Set up and try out in your local environment
                </p>
            </div>
        </div>
    </div>
</div>
{% raw %}
<style>
.md-sidebar.md-sidebar--primary {
    display: none;
}
.md-sidebar.md-sidebar--secondary{
    display: none;
}
.section02 {
    display: flex;
    justify-content: space-between;
}
header.md-header .md-header__button:not([hidden]) {
    /* display: none; */
}
.about-home {
    display: flex;
}
/* .about-home div:first-child {
    width: 50%;
    padding-top: 20px;
}
.about-home div:nth-child(2) {
    width: 50%;
} */
@media screen and (max-width: 76.1875em) {
    .md-sidebar.md-sidebar--primary {
        display: block;
    }
}
@media screen and (max-width: 945px) {
    .about-home div:first-child {
        width: 100%;
    }
    .about-home div:nth-child(2) {
        width: 100%;
    }
    .about-home {
        flex-direction: column;
    }
    .md-typeset a {
        background-position-x: left;
    }
    .download-btn-wrapper {
        display: block;
        text-align: center;
    }
}
.md-typeset h1{
    visibility: hidden;
    margin-bottom: 0;
}
</style>
{% endraw %}