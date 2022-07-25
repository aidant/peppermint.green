<script lang="ts">
  import type { SvelteComponent } from 'svelte'
  import Dialog from '../components/dialog.svelte'
  import FloatingActionButton from '../components/floating-action-button.svelte'
  import IconGoals from '../components/icon-goals.svelte'
  import IconIncomming from '../components/icon-incomming.svelte'
  import IconOutgoing from '../components/icon-outgoing.svelte'
  import IconStatistics from '../components/icon-statistics.svelte'
  import IconTransactions from '../components/icon-transactions.svelte'
  import TabsContentContainer from '../components/tabs-content-container.svelte'
  import TabsContent from '../components/tabs-content.svelte'
  import TabsNavigationContainer from '../components/tabs-navigation-container.svelte'
  import TabsNavigation from '../components/tabs-navigation.svelte'
  import Tabs from '../components/tabs.svelte'
  import { CSVDecoderStream, CSVObjectDecoderStream } from '../services/csv'
  import { TransactionNormalizerStream, TransactionWritableStream } from '../services/transactions'
  import ImportTransactions from './import-transactions.svelte'
  import PageTransactions from './page-transactions.svelte'

  let dialog: typeof SvelteComponent | null = null

  const handleAction = () => {
    dialog = ImportTransactions
  }

  const handleClose = () => {
    dialog = null
  }

  const handleCSV = (event: CustomEvent<ReadableStream<Uint8Array>>) => {
    dialog = null

    event.detail
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new CSVDecoderStream())
      .pipeThrough(new CSVObjectDecoderStream())
      .pipeThrough(new TransactionNormalizerStream())
      .pipeTo(new TransactionWritableStream())
  }
</script>

<Tabs>
  <FloatingActionButton on:click={handleAction} />
  {#if dialog}
    <Dialog on:close={handleClose}>
      <svelte:component this={dialog} on:csv={handleCSV} />
    </Dialog>
  {/if}
  <TabsNavigationContainer>
    <TabsNavigation href="#incomming"><IconIncomming /></TabsNavigation>
    <TabsNavigation href="#transactions"><IconTransactions /></TabsNavigation>
    <TabsNavigation href="#outgoing"><IconOutgoing /></TabsNavigation>
    <TabsNavigation href="#statistics"><IconStatistics /></TabsNavigation>
    <TabsNavigation href="#goals"><IconGoals /></TabsNavigation>
  </TabsNavigationContainer>
  <TabsContentContainer>
    <TabsContent id="incomming">
      Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming
      Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming
      Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming
      Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming
      Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming
      Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming
      Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming
      Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming
      Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming
      Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming
      Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming
      Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming
      Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming
      Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming
      Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming
      Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming Incomming
    </TabsContent>
    <TabsContent id="transactions">
      <PageTransactions />
    </TabsContent>
    <TabsContent id="outgoing">
      Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing
      Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing
      Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing
      Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing
      Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing
      Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing
      Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing
      Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing
      Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing
      Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing
      Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing
      Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing
      Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing
      Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing
      Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing
      Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing
      Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing
      Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing
      Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing
      Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing
      Outgoing Outgoing Outgoing Outgoing Outgoing Outgoing
    </TabsContent>
    <TabsContent id="statistics">
      Statistics Statistics Statistics Statistics Statistics Statistics Statistics Statistics
      Statistics Statistics Statistics Statistics Statistics Statistics Statistics Statistics
      Statistics Statistics Statistics Statistics Statistics Statistics Statistics Statistics
      Statistics Statistics Statistics Statistics Statistics Statistics Statistics Statistics
      Statistics Statistics Statistics Statistics Statistics Statistics Statistics Statistics
      Statistics Statistics Statistics Statistics Statistics Statistics Statistics Statistics
      Statistics Statistics Statistics Statistics Statistics Statistics Statistics Statistics
      Statistics Statistics Statistics Statistics Statistics Statistics Statistics Statistics
      Statistics Statistics Statistics Statistics Statistics Statistics Statistics Statistics
      Statistics Statistics Statistics Statistics Statistics Statistics Statistics Statistics
      Statistics Statistics Statistics Statistics Statistics Statistics Statistics Statistics
      Statistics Statistics Statistics Statistics Statistics Statistics Statistics Statistics
      Statistics Statistics Statistics Statistics Statistics Statistics Statistics Statistics
      Statistics Statistics Statistics Statistics Statistics Statistics Statistics Statistics
      Statistics Statistics Statistics Statistics Statistics Statistics Statistics Statistics
      Statistics Statistics Statistics Statistics Statistics Statistics Statistics Statistics
      Statistics Statistics Statistics Statistics Statistics Statistics Statistics Statistics
      Statistics Statistics Statistics Statistics Statistics Statistics Statistics Statistics
      Statistics Statistics Statistics Statistics Statistics Statistics Statistics Statistics
      Statistics Statistics Statistics Statistics Statistics Statistics Statistics Statistics
      Statistics Statistics Statistics Statistics Statistics Statistics Statistics Statistics
      Statistics Statistics Statistics Statistics Statistics
    </TabsContent>
    <TabsContent id="goals">
      Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals
      Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals
      Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals
      Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals
      Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals
      Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals
      Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals
      Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals
      Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals
      Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals
      Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals
      Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals
      Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals
      Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals
      Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals
      Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals
      Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals
      Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals
      Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals
      Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals
      Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals
      Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals Goals
      Goals Goals Goals Goals Goals Goals
    </TabsContent>
  </TabsContentContainer>
</Tabs>
