


<%While Not rs.eof 
			counter = counter +1	%>          
         <tr>
          <%
             for x=1 to 1
			 	DueDate	= ""
				BRedTo	= ""
				ExternalStudID	= 0
				ServiceSireID	= 0

				  if rs.eof then
					exit for
                 end if 
                alpacaID = rs("Animals.ID")
               'response.write( alpacaID)
               	alpacasPrice= rs("Price")

		 photoID = "nophoto"
  
        imagelength = len(rs("ListPageImage"))
		if  imagelength > 5 then
            photoID = rs("ListPageImage")
		Else
			photoID = "NotAvailable.jpg"
		
		end if
'response.write(rs("ListPageImage"))
         If Len(rs("ListPageImage")) < 4 then 
			     click =  " <form action=""Details.asp"" method=""get"">" &_
                             "<input name=ID type=hidden value=" &  alpacaID & ">" & hiddenInput &_
							  "<input name=DetailType type=hidden value=" & DetailType & ">" &_
                            "<input name=Detail type=image src=""/uploads/ListPage/NotAvailable.jpg""  border=0  width=""150"" ></form>"
			Else
   			     click =  " <form action=""Details.asp"" method=""get"">" &_
                             "<input name=ID type=hidden value=" &  alpacaID & ">" & hiddenInput &_
							  "<input name=DetailType type=hidden value=" & DetailType & ">" &_
                            "<input name=Detail type=image src=""/uploads/ListPage/" & PhotoID &"""  border=0  width=""150"" ></form>"     
                End If

			'If Len(rs("DueDate"))> 1 then
			'	DueDate	=rs("DueDate")
			'	BRedTo	=rs("ServiceSire")
			'	ExternalStudID	=rs("ExternalStudID")
			'	ServiceSireID	=rs("ServiceSireID")
		    'End if
				%> 
				
			<% Category = rs("Category")%>

		<td align="center" width = "165" valign = "top" class = "body" rowspan = "2" bgcolor = "#dfdfdf">                          
            <table border = "0"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 style="border-style: ridge; border-color: #811c35 ; border-right-width: 3; border-left-width: 2; border-top-width: 2; border-bottom-width: 3" >
			  <tr><td><a href = "Details.asp?ID=<%=alpacaID%>&DetailType=<%=DetailType%>" ><img src = "/uploads/ListPage/<%= PhotoID %>" width="100" border = "0"></a></td></tr></table>
			  <br>
			  Lot # 1
	       </td>

	     <td class= "body"  valign = "top" width = "600" bgcolor = "#dfdfdf">
								<a href = "Details.asp?ID=<%=alpacaID%>&DetailType=<%=DetailType%>&Detail.x=53&Detail.y=21" class = "body"><h2><big><%=Trim(rs("FullName"))%></big></h2></a>
								
			</td>
			</tr>
			<tr>
				<td class= "body"  valign = "top" bgcolor = "#dfdfdf">
								<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
									<tr>
										<% If Len(rs("price")) > 2 Then %>
												<td valign = "top" class = "body" >
												Price:
											<br>
										</td>
										<% End If %>
										<% If Len(rs("price")) > 2 Then %>
										<td valign = "top" class = "body" colspan = "4">
												<b><%=(rs("price"))%></b><br>
											</td>
									<tr>
									<% End If %>


								


										<td valign = "top" class = "body" width = "45">
											Color: <br>
											DOB: <br>
											
											
										</td>
										<td valign = "top" class = "body" width = "300" >
											<%=rs("Color")%><br>
											<% If Len(rs("DOB")) > 2 Then %>
												<%=rs("DOB")%><br>
												<% End If %>

											
											
											</td>
										</tr>
								
										
											
<%
			SireName = rs("Sire")
			'response.write(SireName)
			DBSireName = SireName
			str1 = SireName
			str2 = "'"
			If InStr(str1,str2) > 0 Then
				DBSireName= Replace(str1, "'", "''")
				DBSireName = trim(DBSireName)
			End If

			Set rsSire = Server.CreateObject("ADODB.Recordset")
			sqlSire = "select ID, FullName from Animals where trim(FullName) = '"  & DBSireName & "'"
			rsSire.Open sqlSire, conn, 3, 3 

			if not rsSire.eof then 
				SireChoice = 1 %>
				<%counter = counter +1
				SireName 	= trim(rsSire("FullName"))
				SireID 	= rsSire("ID")%>
					
		<%
			else if len(SireLink) > 1 then 
				SireChoice = 2
			else SireChoice = 3 
		   end if
		end if
		rsSire.close
		set rsSire=nothing
		if SireChoice = 1 then %>	

		<% end if %>





<%
			DamName = rs("DamName")
			'response.write(SireName)
			DBDamName = DamName
			str1 = DamName
			str2 = "'"
			If InStr(str1,str2) > 0 Then
				DBDamName= Replace(str1, "'", "''")
				DBDamName = trim(DBDamName)
			End If

			Set rsDam = Server.CreateObject("ADODB.Recordset")
			sqlDam = "select ID, FullName from Animals where trim(FullName) = '"  & DBDamName & "'"
			rsDam.Open sqlDam, conn, 3, 3 

			if not rsDam.eof then 
				DamChoice = 1 %>
				<%Dcounter = Dcounter +1
				DamName 	= trim(rsDam("FullName"))
				DamID 	= rsDam("ID")%>
				
				
		<%
			else if len(DamLink) > 1 then
				DamChoice = 2
			else DamChoice = 3
		   end if
		end if
		rsDam.close
		set rsDam=nothing
		%>

<td valign = "top" class = "body" >Sire:</td>
<% if SireChoice = 1 then  %>
			<tr>
				<td valign = "top" class = "body" ><a href = "Details.asp?ID=<%=SireID%>&DetailType=Sire&Detail.x=53&Detail.y=21" class = "body"><%=SireName%></a></td>

	
		<%
			else if  SireChoice = 2 then%>
					<td valign = "top" class = "body" ><a class = "body" target = "_blank" href ="http://<%=SireLink%>"> <%=SireName%></a></td>
			<%else %>
					<td valign = "top" class = "body" ><%=SireName%></td>
					<%
		   end if
		end if
%>

</tr>
<tr>
<td valign = "top" class = "body" >Dam:</td>
<%if DamChoice = 1 then %>
				<td valign = "top" class = "body" ><a href = "Details.asp?ID=<%=DamID%>&DetailType=Dam&Detail.x=53&Detail.y=21" class = "body"><%=DamName%></a></td>

		<%
			else if DamChoice = 2 then%>
					<td valign = "top" class = "body" ><a class = "slink" target = "_blank" href =<%=DamLink%>> <%=DamName%></a></td>
			<%else %>
					<td valign = "top" class = "body" ><%=DamName%></td>
				
					<%
		   end if
		  end if
		%>
				
			</td>
		</tr>
		<%' If Len(rs("DueDate"))> 1 Then %>
			<!'--#Include file="/ServiceSireIncludeDB.asp"--> 
		 <%' End If %>



		<tr>
			<td colspan ="2" class = "body" valign = "top" width = "350">
				<% If Len(rs("Pricecomments")) > 3 then%>
									<%=rs("PriceComments")%><br>
								<% End If %>
				<br><div align = "right"><a href = "Details.asp?ID=<%=alpacaID%>&DetailType=<%=DetailType%>&Detail.x=53&Detail.y=21" class = "body">Click here for more information</a></div><br><br>
				</td>
			</tr>
		</table>
		</form>
		</td>
             <% rs.movenext
             next %>
           </tr>
          <%     
         Wend %>
        
       </form>
       </table>