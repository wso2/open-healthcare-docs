<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
<div class="homePage">
    <div class="section01">
        <div class="leftContent">
            <div class="about-home">
                <div>
					<div class="md-main .md-content">
                        <p>
                        WSO2 Healthcare Solution is a comprehensive solution that enables healthcare organizations to achieve interoperability and compliance with healthcare standards such as Fast Healthcare Interoperability Resources (FHIR®) and Health Level Seven (HL7®). With WSO2’s robust integration capabilities, you can enhance your healthcare system with features like patient data management, claims processing, and electronic health records (EHR) interoperability. The platform supports healthcare standards, real-time data transformations and security and privacy features, offering the flexibility to meet evolving healthcare needs.
						</p>
						<p>
						Get a head start with our Quick Start Guide or dive straight into the documentation to understand what we offer 
						and to discover the extensibility.
						</p>
					</div>
                </div>
                <!-- <div>
                        <div class="md-main .md-content ">
							<iframe width="800" height="250" src="https://www.youtube.com/embed/YabdNpDlS2s" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
						</div>
                </div> -->
            </div>
            <div>
                <div class="md-main .md-content ">
					<iframe width="600" height="340" src="https://www.youtube.com/embed/YabdNpDlS2s" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                    </iframe>
				</div>
            </div>
        </div>
    </div>
	<div class="section03">
        <h3>What can WSO2 Healthcare Solution do?</h3>
        <div class="linkWrapper">
            <div class="linkSet3" onclick="location.href='{{base_path}}/get-started/open-healthcare';">
                <a href="get-started/open-healthcare-quickstart/"><h3>Quick Start Guide</h3></a>
                <p>
                    Set up and try out in your local environment
                </p>
            </div>
            <div class="linkSet3" onclick="location.href='{{base_path}}/get-started/open-healthcare';">
                <a href="fhir/guides/overview-of-fhir"><h3>Working with FHIR</h3></a>
                <p>
                    Working with FHIR resources and operations
                </p>
            </div>
            <div class="linkSet3" onclick="location.href='{{base_path}}/get-started/open-healthcare';">
                <a href="hl7/guides/overview/"><h3>Working with HL7</h3></a>
                <p>
                    Working with HL7 messages and operations
                </p>
            </div>
        </div>
    </div>
    <div class="section04">
        <div class="linkWrapper">
            <div class="linkSet2" onclick="location.href='{{base_path}}/learn/integration-use-case/connectors';">
                <a href="data-transformation/guides/hl7v2-fhir"><h3>Data Transformation</h3></a>
                <p>
                    Data transformation between different healthcare standards
                </p>
            </div>
            <div class="linkSet2" onclick="location.href='{{base_path}}/get-started/introduction';">
                <a href="emr-connectivity/guides/emr-systems-overview"><h3>EMR Connectivity</h3></a>
                <p>
                    Connect to Electronic Medical Records (EMR) systems
                </p>
            </div>
            <div class="linkSet3">
                <!-- <a href="emr-connectivity/guides/emr-systems-overview"><h3>EMR Connectivity</h3></a>
                <p>
                    Connect to Electronic Medical Records (EMR) systems
                </p> -->
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