import {
    Autowired,
    Component,
    Context,
    GridOptionsWrapper,
    IStatusPanelComp,
    PostConstruct
} from 'ag-grid-community';

export class NameValueComp extends Component implements IStatusPanelComp {
    @Autowired('gridOptionsWrapper') private gridOptionsWrapper: GridOptionsWrapper;
    @Autowired('context') private context: Context;

    private static TEMPLATE = `<div class="ag-status-panel ag-status-panel-comp">  
            <span id="_label"></span>  
            <span id="_value"></span>
        </div>`;

    private props: { key: string, defaultValue: string };

    private lbValue: HTMLElement;

    constructor(private key: string, private defaultValue: string) {
        super(NameValueComp.TEMPLATE);
    }

    @PostConstruct
    protected postConstruct(): void {
        if(this.props) {
            this.key = this.props.key;
            this.defaultValue = this.props.defaultValue;
        }

        // we want to hide until the first value comes in
        this.setVisible(false);

        let localeTextFunc = this.gridOptionsWrapper.getLocaleTextFunc();
        this.queryForHtmlElement('#_label').innerHTML = localeTextFunc(this.key, this.defaultValue);

        this.lbValue = this.queryForHtmlElement('#_value');
    }

    public setValue(value: any): void {
        this.lbValue.innerHTML = value;
    }
}