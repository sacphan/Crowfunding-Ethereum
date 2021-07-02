import React, { Component } from 'react';
import { Button, Table, Grid, Icon, Label } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';
import Campaings from '../../../Ethereum/campaign';
import RequestRow from '../../../components/RequestRow';
import web3 from '../../../Ethereum/web3';
import styles from '../requests/request.module.css'
// import "../requests/temp.scss"
export default class RequestIndex extends Component {

    static async getInitialProps(props) {
        const { address } = props.query;
        const campaign = Campaings(address);
        const requestCount = await campaign.methods.getRequestsCount().call();
        const approversCount = await campaign.methods.approversCount().call();
        const summary = await campaign.methods.getSummary().call();
        const contractBalance = summary[1];

        const requests = await Promise.all(
            Array(parseInt(requestCount)).fill().map((element, index) => {
                return campaign.methods.requests(index).call()
            })
        );

        return { address, requests, requestCount, approversCount, contractBalance };
    }

    renderRows() {
        return this.props.requests.map((request, index) => {
            return <RequestRow
                key={index}
                request={request}
                id={index}
                address={this.props.address}
                approversCount={this.props.approversCount}
            />;
        });
    }

    render() {
        //Create Campaige
        const { Header, Row, HeaderCell, Body } = Table;
        const campaignsBalance = this.props.contractBalance;

        return (
            <div style={{height: "101vh", backgroundColor: "#1F2739"}}>
                <Layout>
                    <h3 style = {{color: "gold"}}>Request</h3>
                    <Grid columns='equal'>
                        <Grid.Row>
                            <Grid.Column>
                                <Link route={`/campaigns/${this.props.address}/`}>
                                    <a>
                                        <Button icon><Icon name='home' /></Button>
                                    </a>
                                </Link>
                            </Grid.Column>
                            <Grid.Column textAlign='center'>
                                <Label>
                                    <Icon name='ethereum' /> {web3.utils.fromWei(campaignsBalance, 'ether')} ether
                                </Label>
                            </Grid.Column>
                            <Grid.Column textAlign='right'>
                                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                                    <a>
                                        <Button primary>Add Request</Button>
                                    </a>
                                </Link>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>


                    <Table className={styles.mytable}>
                        <Header>
                            <Row >
                                <HeaderCell className={styles.tableheader}>ID</HeaderCell>
                                <HeaderCell className={styles.tableheader}>Description</HeaderCell>
                                <HeaderCell className={styles.tableheader}>Amount</HeaderCell>
                                <HeaderCell className={styles.tableheader}>Recipient</HeaderCell>
                                <HeaderCell className={styles.tableheader}>Approval</HeaderCell>
                                <HeaderCell className={styles.tableheader}>Approve</HeaderCell>
                                <HeaderCell className={styles.tableheader}>Finalize</HeaderCell>
                            </Row>
                        </Header>

                        <Body >
                            {this.renderRows()}
                        </Body>
                    </Table>

                    <div style= {{color:"antiquewhite"}}>Found {this.props.requestCount} requests.</div>

                </Layout>

            </div>
        )
    }
}
