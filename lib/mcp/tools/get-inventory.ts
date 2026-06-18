export async function getInventory(params: { items?: string[]; low_stock_only?: boolean }) {
  const mockInventory = [
    { item: 'ThinkPad T14', current_stock: 4, reorder_point: 10, supplier: 'Lenovo Direct', lead_time_days: 14 },
    { item: 'MacBook Pro 16', current_stock: 2, reorder_point: 5, supplier: 'Apple Business', lead_time_days: 7 },
    { item: 'Dell Monitor 27"', current_stock: 15, reorder_point: 20, supplier: 'CDW', lead_time_days: 5 },
    { item: 'Logitech Mouse', current_stock: 45, reorder_point: 30, supplier: 'Amazon Business', lead_time_days: 2 },
    { item: 'Jabra Headset', current_stock: 8, reorder_point: 15, supplier: 'CDW', lead_time_days: 4 }
  ];
  
  let results = mockInventory;
  
  if (params.items && params.items.length > 0) {
    results = results.filter(i => params.items!.includes(i.item));
  }
  
  if (params.low_stock_only) {
    results = results.filter(i => i.current_stock <= i.reorder_point);
  }
  
  // If items were requested but not in our mock DB, add them with mock data
  if (params.items) {
    for (const item of params.items) {
      if (!results.find(i => i.item === item)) {
        results.push({
          item,
          current_stock: Math.floor(Math.random() * 20),
          reorder_point: 10,
          supplier: 'Default Supplier',
          lead_time_days: 7
        });
      }
    }
  }
  
  return results;
}
