import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions } from '../actions'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dialog } from 'primereact/dialog'


const mapStateToProps = function(state) {
  return {
    virtualShelfList : state.virtualshelf.virtualShelfList,
    loading : state.virtualshelf.fetching
  }
}

const mapDispatchToProps = function(dispatch) {
  return {
    actions: bindActionCreators({
      getVirtualShelf: actions.GET_VIRTUALSHELF,
      addVirtualShelf: actions.ADD_VIRTUALSHELF,
      updateVirtualShelf : actions.UPDATE_VIRTUALSHELF,
      deleteVirtualShelf : actions.DELETE_VIRTUALSHELF
    }, dispatch)
  }
}


class Editor extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      isAddDialogShown: false,
      isNewVirtualShelf : true,
      virtualShelf: {
        description: '',
        date: ''
      }
    }

    this.hideDialog = () => {
      this.setState({
        isAddDialogShown : false
      })
    }

    this.updateProperty = (property, value) => {
      let virtualShelf = this.state.virtualShelf
      virtualShelf[property] = value
      this.setState({
        virtualShelf: virtualShelf
      })
    }

    this.addNew = () => {
      let emptyVirtualShelf = {
        description: '',
        date: ''
      }
      this.setState({
        virtualShelf: emptyVirtualShelf,
        isAddDialogShown: true
      })
    }

    this.saveVirtualShelf = () => {
      if (this.state.isNewVirtualShelf) {
        this.props.actions.addVirtualShelf(this.state.virtualShelf)
      } else {
        this.props.actions.updateVirtualShelf(this.state.virtualShelf.id, this.state.virtualShelf)
      }
      this.setState({
        isAddDialogShown : false,
        virtualShelf: {
            description: '',
            date: ''
        }
      })
    }

    this.deleteVirtualShelf = (rowData) => {
      this.props.actions.deleteVirtualShelf(rowData.id)
    }

    this.editVirtualShelf = (rowData) => {
      let virtualShelfCp = Object.assign({}, rowData)
      this.setState({
        virtualShelf: virtualShelfCp,
        isNewVirtualShelf: false,
        isAddDialogShown: true
      })
    }

    this.tableFooter = <div>
      <span>
        <Button label="Add" onClick={this.addNew} icon="pi pi-plus" />
      </span>
    </div>

    this.addDialogFooter = <div>
      <Button   label="Save" icon="pi pi-save" onClick={() => this.saveVirtualShelf()} />
    </div>

    this.opsTemplate = (rowData) => {
      return <>
          <Button icon="pi pi-times" className="p-button-danger" onClick={() => this.deleteVirtualShelf(rowData)}  />
          <Button icon="pi pi-pencil" className="p-button-warning" onClick={() => this.editVirtualShelf(rowData)} />
      </>
    }
  }

  componentDidMount(){
    this.props.actions.getVirtualShelf()
  }

  render () {
    const { virtualShelfList } = this.props
    return (
      <>
        <DataTable value={virtualShelfList} footer={this.tableFooter} >
          <Column header='Description' field='description' />
          <Column header='Date' field='date' />
          <Column body={this.opsTemplate} />
        </DataTable>
        {
          this.state.isAddDialogShown ?
            <Dialog   visible={this.state.isAddDialogShown} 
                      header='Add new virtual shelf' 
                      footer={this.addDialogFooter}
                      onHide={this.hideDialog}>
              <InputText onChange={(e) => this.updateProperty('description', e.target.value)} value={this.state.virtualShelf.description} name="description" placeholder="description" />
              <InputText onChange={(e) => this.updateProperty('date', e.target.value)} value={this.state.virtualShelf.date} name="date" placeholder="date" />
              
            </Dialog>
          :
            null
        }
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)