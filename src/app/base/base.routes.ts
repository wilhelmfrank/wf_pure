import { Route } from "@angular/router";
import { PageNotFoundComponent } from "../shared/components/page-not-found/page-not-found.component";
import { PureComponent } from "../pure/pure.component";
import { ItemSearchComponent } from "../pure/item-search/item-search.component";
import { ItemFormComponent } from "../pure/item-edit-next/form/item-form/item-form.component copy";
import { itemResolver } from "../pure/services/item--resolver";
import { DynTreeComponent } from "../shared/components/dyn-tree.component";

export const BASE_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full'
  },
  {
    path: 'start',
    component: PureComponent
  },
  {
    path: 'ou_tree',
    component: DynTreeComponent
  },
  {
    path: 'as', component: ItemSearchComponent, data: {
      saveComponent: true
    }
  },
  {
    path: 'edit/:id', component: ItemFormComponent, resolve: { item: itemResolver }
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
]