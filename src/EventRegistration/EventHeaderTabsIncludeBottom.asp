




 <table border = "0" cellpadding = "0" cellspacing = "0" width = "100%">
     <tr>
     
     
   <% if ShowHalterShow = True then %>
        <% if Current = "Halter" then %>

      <td class = "body2" width = "90" height = "30" align = "center" background = "images/BottomTabOn.jpg"><b><a href = "EventHalter.asp?regEventID=<%=eventID%>" class = "menu2">Halter Show</a></b></td>
      
     <% else %> 
            <td class = "body2" width = "90" height = "30" align = "center" background = "images/BottomTabOff.jpg"><b><a href = "EventHalter.asp?regEventID=<%=eventID%>" class = "menu2">Halter Show</a></b></td>
	<% end if %>
   <% end if %>
   
   
   
   
        
  <% if ShowFleeceShow = True then %>
        <% if Current = "Fleece" then %>

    	<td class = "body2" width = "90" height = "30" align = "center" background = "images/BottomTabOn.jpg"><b><a href = "EventFleece.asp?EventID=<%=eventID%>" class = "menu2">Fleece Show</a></b></td>
      
     <% else %> 
		<td class = "body2" width = "90" height = "30" align = "center" background = "images/BottomTabOff.jpg"><b><a href = "EventFleece.asp?EventID=<%=eventID%>" class = "menu2">Fleece Show</a></b></td>
	<% end if %>
   <% end if %>

   
   
   
    <% if ShowAdvertising = True then %>
      <% if Current = "Advertising" then %>
		   <td class = "body2"  width = "90" height = "30" align = "center" background = "images/BottomTabOn.jpg"><b><a href = "EventAdvertising.asp?EventID=<%=eventID%>" class = "menu2">Advertising</a></b></td>
	   <% else %>
	   		<td class = "body2"  width = "90" height = "30" align = "center" background = "images/BottomTabOff.jpg"><b><a href = "EventAdvertising.asp?EventID=<%=eventID%>" class = "menu2">Advertising</a></b></td>
	   <% end if %>
	     <% end if %>
	   
      
   <% if ShowVendors = True then %>
    <% if Current = "Vendors" then %>
	   <td class = "body2" width = "90" height = "30" align = "center" background = "images/BottomTabOn.jpg"><b><a href = "EventVendors.asp?EventID=<%=eventID%>" class = "menu2">Vendors</a></b></td>
	<% else %>
		   <td class = "body2" width = "90" height = "30" align = "center" background = "images/BottomTabOff.jpg"><b><a href = "EventVendors.asp?EventID=<%=eventID%>" class = "menu2">Vendors</a></b></td>
   <% end if %>
    <% end if %>
   
   
   
     <% if ShowSponsors = True then %>
         <% if Current = "Sponsors" then %>
   			<td class = "body2" width = "90" height = "30" align = "center" background = "images/BottomTabOn.jpg"><b><a href = "EventSponsors.asp?EventID=<%=eventID%>" class = "menu2">Sponsorships</a></b></td>
   	 <% else %>
   	    	<td class = "body2" width = "90" height = "30" align = "center" background = "images/BottomTabOff.jpg"><b><a href = "EventSponsors.asp?EventID=<%=eventID%>" class = "menu2">Sponsorships</a></b></td>
   <% end if %>
      <% end if %>
   
     <% if ShowClasses = True then %>
        <% if Current = "Classes" then %>
   	<td class = "body2" width = "90" height = "30" align = "center" background = "images/BottomTabOn.jpg"><b><a href = "EventClasses.asp?EventID=<%=eventID%>" class = "menu2">Classes / Workshops</a></b></td>
   	     <% else %>
   	    <td class = "body2" width = "90" height = "30" align = "center" background = "images/BottomTabOff.jpg"><b><a href = "EventClasses.asp?EventID=<%=eventID%>" class = "menu2">Classes / Workshops</a></b></td>
 	 <% end if %>
   <% end if %>
   
   
       <% if  ShowDinner = True then %>
               <% if Current = "Dinner" then %>
    		<td class = "body2"  width = "90" height = "30" align = "center" background = "images/BottomTabOn.jpg"><b><a href = "EventDinner.asp?EventID=<%=eventID%>" class = "menu2">Dinner</a></b></td>
    		<% else %>
    		 <td class = "body2"  width = "90" height = "30" align = "center" background = "images/BottomTabOff.jpg"><b><a href = "EventDinner.asp?EventID=<%=eventID%>" class = "menu2">Dinner</a></b></td>
    <% end if %>
        <% end if %>
        
    
     <% if  ShowSilentAuction = True then %>
         <% if Current = "Silent Auction" then %>
				<td class = "body2"  width = "90" height = "30" align = "center" background = "images/BottomTabOn.jpg"><b><a href = "EventSilentAuction.asp?EventID=<%=eventID%>" class = "menu2">Silent Auction</a></b></td>
		<% else %>
				<td class = "body2"  width = "90" height = "30" align = "center" background = "images/BottomTabOff.jpg"><b><a href = "eventSilentAuction.asp?EventID=<%=eventID%>" class = "menu2">Silent Auction</a></b></td>
		<% end if %>
    <% end if %>
    
    
   <% if  ShowStudAuction = True then %>
      <% if Current = "Stud Auction" then %>
    	<td class = "body2"  width = "90" height = "30" align = "center" background = "images/BottomTabOn.jpg"><b><a href = "EventStudAuction.asp?EventID=<%=eventID%>" class = "menu2">Stud Auction</a></b></td>
      <% else %>
        <td class = "body2"  width = "90" height = "30" align = "center" background = "images/BottomTabOff.jpg"><b><a href = "EventStudAuction.asp?EventID=<%=eventID%>" class = "menu2">Stud Auction</a></b></td>
    <% end if %>

   <% end if %>

<% if ShowSpinOff = True then %>
        <% if Current = "SpinOff" then %>

      <td class = "body2" width = "90" height = "30" align = "center" background = "images/BottomTabOn.jpg"><b><a href = "EventSpin-off.asp?EventID=<%=eventID%>" class = "menu2">Spin-off</a></b></td>
      
     <% else %> 
            <td class = "body2" width = "90" height = "30" align = "center" background = "images/BottomTabOff.jpg"><b><a href = "EventSpin-off.asp?EventID=<%=eventID%>" class = "menu2">Spin-Off</a></b></td>
	<% end if %>
   <% end if %>


   


    <td background = "images/BottomTabBlank.jpg">&nbsp;</td>
   </tr>
   </table>
   

